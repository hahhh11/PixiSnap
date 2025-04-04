// src/core/input/KeyboardService.ts
type KeyMap = { [key: string]: boolean };

export class KeyboardService {
	private static instance: KeyboardService;
	private keys: KeyMap = {};

	private constructor() {
		window.addEventListener('keydown', this.onKeyDown.bind(this));
		window.addEventListener('keyup', this.onKeyUp.bind(this));
		window.addEventListener('blur', this.clearKeys.bind(this));
	}

	public static getInstance(): KeyboardService {
		if (!KeyboardService.instance) {
			KeyboardService.instance = new KeyboardService();
		}
		return KeyboardService.instance;
	}

	private onKeyDown(e: KeyboardEvent): void {
		this.keys[e.key.toLowerCase()] = true;
	}

	private onKeyUp(e: KeyboardEvent): void {
		this.keys[e.key.toLowerCase()] = false;
	}

	private clearKeys(): void {
		this.keys = {};
	}

	public isKeyDown(key: string): boolean {
		return this.keys[key.toLowerCase()] || false;
	}

	public getMovementVector(): { x: number; y: number } {
		const vec = { x: 0, y: 0 };

		// WASD 控制
		if (this.isKeyDown('w') || this.isKeyDown('arrowup')) vec.y -= 1;
		if (this.isKeyDown('s') || this.isKeyDown('arrowdown')) vec.y += 1;
		if (this.isKeyDown('a') || this.isKeyDown('arrowleft')) vec.x -= 1;
		if (this.isKeyDown('d') || this.isKeyDown('arrowright')) vec.x += 1;

		// 对角线移动速度标准化
		if (vec.x !== 0 && vec.y !== 0) {
			vec.x *= 0.7071; // 1/√2
			vec.y *= 0.7071;
		}

		return vec;
	}
}
