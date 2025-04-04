import { AnimatedSprite, Container, Sprite } from 'pixi.js';
import { SpriteSheetAnimator } from '../../core/animations/SpriteSheetAnimator';

enum TreeType {
	Normal,
}
export class Tree extends Container {
	private animator: SpriteSheetAnimator;
	_maxHealth;
	_health;
	constructor(options) {
		super();

		this._health = options.health || 100;
		this._maxHealth = this._health;

		let animationConfig = {
			resource: 'Tree',
			frameWidth: 192,
			frameHeight: 192,
			globalSpeed: 0.1,
			animations: [
				{ name: 'idle', startFrame: 0, endFrame: 3, speed: 0.2, loop: true },
				{ name: 'shake', startFrame: 4, endFrame: 5, speed: 0.1, loop: false },
				{ name: 'stakes', startFrame: 4, endFrame: 5, speed: 0.1, loop: false },
			],
		};

		this.animator = new SpriteSheetAnimator(animationConfig);
		this.addChild(this.animator);
	}

	async load(resource: string | { json: string; image: string }): Promise<void> {
		await this.animator.load('Tree');
		this.playAnimation('idle');
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
					this.animator.emit('complete');
					resolve();
				});
			});
		} else {
			this.animator.playAnimation(name, loop);
		}
	}
}
