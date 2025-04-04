/*
 * @Author: 98Precent
 * @Date: 2025-04-04 10:45:50
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-04-04 11:22:01
 * @FilePath: \PixiSnap\src\game\controllers\MovementController.ts
 */
/*
 * @Author: 98Precent
 * @Date: 2025-04-04 10:45:50
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-04-04 10:45:59
 * @FilePath: \PixiSnap\src\game\controllers\MovementController.ts
 */
// src/game/controllers/MovementController.ts
import { Point } from 'pixi.js';
import { KeyboardService } from '../../core/input/KeyboardService';

export class MovementController {
	private readonly keyboard = KeyboardService.getInstance();
	private _velocity: Point = new Point(0, 0);
	private _direction: Point = new Point(0, 1); // 默认朝下

	constructor(private speed: number = 5, private acceleration: number = 0.2, private friction: number = 0.9) {}

	update(delta: number): { velocity: Point; direction: Point } {
		const target = this.keyboard.getMovementVector();
        console.log(target);
        

		// 计算加速度
		this._velocity.x = this.lerp(this._velocity.x, target.x * this.speed, this.acceleration * delta);
		this._velocity.y = this.lerp(this._velocity.y, target.y * this.speed, this.acceleration * delta);

		// 应用摩擦力
		this._velocity.x *= this.friction;
		this._velocity.y *= this.friction;

		// 如果速度很小则归零
		if (Math.abs(this._velocity.x) < 0.01) this._velocity.x = 0;
		if (Math.abs(this._velocity.y) < 0.01) this._velocity.y = 0;

		// 更新方向（只有有输入时更新）
		if (target.x !== 0 || target.y !== 0) {
			this._direction.set(target.x, target.y);
		}

		return {
			velocity: this._velocity,
			direction: this._direction,
		};
	}

	private lerp(current: number, target: number, factor: number): number {
		return current + (target - current) * factor;
	}

	get isMoving(): boolean {
		return this._velocity.x !== 0 || this._velocity.y !== 0;
	}
}
