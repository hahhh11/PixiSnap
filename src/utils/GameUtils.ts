import { Container, Graphics, Point, Rectangle } from 'pixi.js';

/*
 * @Author: 98Precent
 * @Date: 2025-04-04 10:22:02
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-04-04 10:30:38
 * @FilePath: \PixiSnap\src\utils\GameUtils.ts
 */
export class GameUtils {
	// ==================== 数学计算 ====================

	/**
	 * 两点间距离
	 */
	static distance(p1: Point, p2: Point): number {
		return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
	}

	/**
	 * 角度转弧度
	 */
	static degToRad(degrees: number): number {
		return degrees * (Math.PI / 180);
	}

	/**
	 * 弧度转角度
	 */
	static radToDeg(radians: number): number {
		return radians * (180 / Math.PI);
	}

	/**
	 * 标准化向量
	 */
	static normalizeVector(vec: Point): Point {
		const len = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
		return len > 0 ? new Point(vec.x / len, vec.y / len) : new Point(0, 0);
	}

	// ==================== 随机数 ====================

	/**
	 * 随机整数 [min, max]
	 */
	static randomInt(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	/**
	 * 随机浮点数 [min, max)
	 */
	static randomFloat(min: number, max: number): number {
		return Math.random() * (max - min) + min;
	}

	/**
	 * 随机数组元素
	 */
	static randomElement<T>(array: T[]): T {
		return array[Math.floor(Math.random() * array.length)];
	}

	/**
	 * 随机布尔值(指定概率)
	 * @param probability 为true的概率(0-1)
	 */
	static randomBool(probability = 0.5): boolean {
		return Math.random() < probability;
	}

	// ==================== 颜色操作 ====================

	/**
	 * 十六进制颜色转RGB数组
	 */
	static hexToRgb(hex: string): [number, number, number] {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [0, 0, 0];
	}

	/**
	 * RGB转十六进制
	 */
	static rgbToHex(r: number, g: number, b: number): string {
		return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
	}

	/**
	 * 颜色插值
	 * @param color1 起始颜色(十六进制)
	 * @param color2 结束颜色(十六进制)
	 * @param factor 插值因子(0-1)
	 */
	static lerpColor(color1: string, color2: string, factor: number): string {
		const rgb1 = this.hexToRgb(color1);
		const rgb2 = this.hexToRgb(color2);

		const r = Math.round(rgb1[0] + factor * (rgb2[0] - rgb1[0]));
		const g = Math.round(rgb1[1] + factor * (rgb2[1] - rgb1[1]));
		const b = Math.round(rgb1[2] + factor * (rgb2[2] - rgb1[2]));

		return this.rgbToHex(r, g, b);
	}

	// ==================== 显示对象操作 ====================

	/**
	 * 居中显示对象
	 */
	static centerObject(obj: Container, parentWidth: number, parentHeight: number): void {
		obj.position.set((parentWidth - obj.width) / 2, (parentHeight - obj.height) / 2);
	}

	/**
	 * 创建圆形遮罩
	 */
	static createCircleMask(radius: number, x: number = 0, y: number = 0): Graphics {
		const mask = new Graphics();
		mask.circle(x, y, radius);
		mask.fill(0xffffff);
		return mask;
	}

	// ==================== 时间控制 ====================

	/**
	 * 延迟执行
	 */
	static delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	/**
	 * 创建计时器
	 */
	static createTimer(
		duration: number,
		callback: (progress: number) => void
	): {
		stop: () => void;
		promise: Promise<void>;
	} {
		let start = performance.now();
		let running = true;

		const promise = new Promise<void>((resolve) => {
			const update = () => {
				if (!running) return;

				const elapsed = performance.now() - start;
				const progress = Math.min(elapsed / duration, 1);

				callback(progress);

				if (progress < 1) {
					requestAnimationFrame(update);
				} else {
					resolve();
				}
			};

			requestAnimationFrame(update);
		});

		return {
			stop: () => {
				running = false;
			},
			promise,
		};
	}

	// ==================== 碰撞检测 ====================

	/**
	 * AABB碰撞检测
	 */
	static checkAABBCollision(rect1: Rectangle, rect2: Rectangle): boolean {
		return rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y;
	}

	/**
	 * 圆形碰撞检测
	 */
	static checkCircleCollision(pos1: Point, radius1: number, pos2: Point, radius2: number): boolean {
		const dx = pos1.x - pos2.x;
		const dy = pos1.y - pos2.y;
		const distance = Math.sqrt(dx * dx + dy * dy);
		return distance < radius1 + radius2;
	}

	// ==================== 粒子效果 ====================

	/**
	 * 创建爆炸粒子
	 */
	static createExplosion(x: number, y: number, color: number, particleCount = 20): Container {
		const explosion = new Container();
		explosion.position.set(x, y);

		for (let i = 0; i < particleCount; i++) {
			const particle = new Graphics();

			particle.circle(0, 0, Math.random() * 3 + 1);
			particle.fill(color);

			const angle = Math.random() * Math.PI * 2;
			const speed = Math.random() * 5 + 2;

			explosion.addChild(particle);

			GameUtils.createTimer(1000, (progress) => {
				const distance = speed * 50 * progress;
				particle.position.set(Math.cos(angle) * distance, Math.sin(angle) * distance);
				particle.alpha = 1 - progress;
			}).promise.then(() => {
				explosion.removeChild(particle);
			});
		}

		return explosion;
	}
}
