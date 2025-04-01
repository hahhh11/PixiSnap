import { SpriteAnimationOptions, SpriteSheetAnimator } from "../../core/animations/SpriteSheetAnimator";
import { Container, Point, Rectangle } from "pixi.js";

type CharacterState = "idle" | "walk" | "attack" | "hurt" | "die";
type Direction = "left" | "right" | "up" | "down";

interface CharacterOptions {
	speed?: number;
	health?: number;
	scale?: number;
	animationConfig?: SpriteAnimationOptions;
}

export class GameCharacter extends Container {
	private animator: SpriteSheetAnimator;
	private _state: CharacterState = "idle";
	private _direction: Direction = "right";
	private _speed: number;
	private _health: number;
	private _maxHealth: number;
	private isAttacking = false;
	private movementVector = new Point(0, 0);

	constructor(options: CharacterOptions) {
		super();

		this._speed = options.speed || 3;
		this._health = options.health || 100;
		this._maxHealth = this._health;

		this.animator = new SpriteSheetAnimator(options.animationConfig || {});
		this.addChild(this.animator);

		if (options.scale) {
			this.scale.set(options.scale);
		}

		// 启用交互
		this.interactive = true;
		this.on("pointerdown", this.handleClick);
	}

	// 加载角色资源
	async load(resource: string | { json: string; image: string }): Promise<void> {
		await this.animator.load(resource);
		this.playAnimation("idle");
	}

	// 更新角色状态（每帧调用）
	update(delta: number): void {
		// 处理移动
		if (this._state === "walk" && (this.movementVector.x !== 0 || this.movementVector.y !== 0)) {
			this.x += this.movementVector.x * this._speed * delta;
			this.y += this.movementVector.y * this._speed * delta;
		}

		// 更新动画方向
		this.updateAnimationByDirection();
	}

	// 控制方法
	move(direction: Point): void {
		if (this._state === "die" || this.isAttacking) return;

		this.movementVector = direction;

		// 确定主要方向（用于动画选择）
		if (Math.abs(direction.x) > Math.abs(direction.y)) {
			this._direction = direction.x > 0 ? "right" : "left";
		} else if (direction.y !== 0) {
			this._direction = direction.y > 0 ? "down" : "up";
		}

		this.setState("walk");
	}

	stop(): void {
		if (this._state === "die") return;

		this.movementVector.set(0, 0);
		this.setState("idle");
	}

	async attack(aniName?: string): Promise<void> {
		if (this._state === "die" || this.isAttacking) return;

		this.isAttacking = true;

		this.setState("attack", aniName, false);

		// 等待攻击动画完成
		await new Promise<void>((resolve) => {
			this.animator.once("complete", () => {
				this.isAttacking = false;
				this.setState(this.movementVector.x || this.movementVector.y ? "walk" : "idle");
				resolve();
			});
		});
	}

	takeDamage(amount: number): void {
		if (this._state === "die") return;

		this._health = Math.max(0, this._health - amount);

		if (this._health <= 0) {
			this.die();
		} else if (this.animator.hasAnimation("hurt")) {
			this.playAnimation("hurt", false).then(() => {
				this.setState(this._state); // 恢复之前的状态
			});
		}
	}

	die(): void {
		this._state = "die";
		this.movementVector.set(0, 0);

		if (this.animator.hasAnimation("die")) {
			this.playAnimation("die", false);
		} else {
			this.playAnimation("idle");
		}

		this.emit("died");
	}

	revive(health: number = this._maxHealth): void {
		this._health = health;
		this._state = "idle";
		this.playAnimation("idle");
	}

	// 私有方法
	private setState(newState: CharacterState, aniName?: string, loop: boolean = true): void {
		if (this._state === newState || this._state === "die") return;

		this._state = newState;
		this.playAnimation(aniName || newState, loop);
	}

	private updateAnimationByDirection(): void {
		const directionSuffix = this._direction ? `_${this._direction}` : "";
		const animationName = `${this._state}${directionSuffix}`;

		if (this.animator.hasAnimation(animationName)) {
			this.animator.playAnimation(animationName);
		} else {
			this.animator.playAnimation(this._state);
		}
	}

	private async playAnimation(name: string, loop: boolean = true): Promise<void> {
		if (!this.animator.hasAnimation(name)) {
			console.warn(`Animation ${name} not found`);
			return;
		}

		this.animator.loop = loop;

		if (!loop) {
			return new Promise<void>((resolve) => {
				this.animator.playAnimation(name, loop, () => {
					this.animator.emit("complete");
					resolve();
				});
			});
		} else {
			this.animator.playAnimation(name, loop);
		}
	}

	private handleClick(): void {
		if (this._state !== "die") {
			this.attack();
		}
	}

	// 属性访问器
	get state(): CharacterState {
		return this._state;
	}

	get direction(): Direction {
		return this._direction;
	}

	get speed(): number {
		return this._speed;
	}

	set speed(value: number) {
		this._speed = Math.max(0, value);
	}

	get health(): number {
		return this._health;
	}

	get maxHealth(): number {
		return this._maxHealth;
	}

	get isAlive(): boolean {
		return this._state !== "die";
	}
}
