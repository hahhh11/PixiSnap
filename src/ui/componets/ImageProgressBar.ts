import { Container, Graphics, Sprite, TilingSprite, Texture, WRAP_MODES } from "pixi.js";
import { gsap } from "gsap";

export type ImageProgressBarOptions = {
	width?: number;
	height?: number;
	direction?: "horizontal" | "vertical";
	bgTexture?: Texture | string;
	fillTexture: Texture | string;
	borderRadius?: number; // 新增圆角半径
	fillPadding?: {
		top?: number;
		left?: number;
		right?: number;
		bottom?: number;
	};
	tileMode?: "stretch" | "repeat";
	animationDuration?: number;
};

export class ImageProgressBar extends Container {
	private bg: Sprite;
	private fill: Sprite;
	private fillMask: Graphics;
	private currentProgress = 0;
	private tween?: gsap.core.Tween;

	constructor(public options: ImageProgressBarOptions) {
		super();
		const texture = this.resolveTexture(options.fillTexture);
		// 参数默认值
		this.options = {
			direction: "horizontal",
			borderRadius: 0,
			fillPadding: {},
			tileMode: "stretch",
			animationDuration: 0.4,
			width: texture.orig.width, // ✅ 自动获取纹理宽度
			height: texture.orig.height, // ✅ 自动获取纹理高度
			...options,
		};

		// 初始化元素
		this.bg = this.createBackground();
		this.fill = this.createFill();
		this.fillMask = this.createMask();

		this.addChild(this.bg, this.fill);
		this.fill.mask = this.fillMask;
	}

	private createBackground(): Sprite {
		const texture = this.resolveTexture(this.options.bgTexture);
		const bg = new Sprite(texture);
		bg.width = this.options.width;
		bg.height = this.options.height;
		return bg;
	}

	private createFill(): Sprite {
		const texture = typeof this.options.fillTexture === "string" ? Texture.from(this.options.fillTexture) : this.options.fillTexture;

		// 关键设置：禁用纹理重复，启用线性拉伸
		texture.source.scaleMode = "linear"; // 保持拉伸平滑
		texture.source.wrapMode = "clamp-to-edge";

		const sprite = new Sprite(texture);
		sprite.width = this.options.direction === "horizontal" ? this.options.width : texture.orig.width;
		sprite.height = this.options.direction === "vertical" ? this.options.height : texture.orig.height;
		return sprite;
	}

	private createMask(): Graphics {
		const mask = new Graphics();
		this.addChild(mask); // 必须添加到显示列表
		return mask;
	}

	private resolveTexture(source: Texture | string): Texture {
		return typeof source === "string" ? Texture.from(source) : source;
	}

	// 更新进度（0-1）
	async update(progress: number, immediate = false): Promise<void> {
		return new Promise((resolve) => {
			const target = Math.min(1, Math.max(0, progress));

			this.tween?.kill();

			if (immediate) {
				this.setProgress(target);
				resolve();
			} else {
				this.tween = gsap.to(this, {
					currentProgress: target,
					duration: this.options.animationDuration,
					onUpdate: () => this.setProgress(this.currentProgress),
					onComplete: resolve,
				});
			}
		});
	}

	private setProgress(value: number) {
		const padding = this.options.fillPadding || {};
		const minSize = 1;

		// 计算填充尺寸
		const [fillWidth, fillHeight] = this.calculateFillSize(value);

		// 更新填充元素
		this.fill.width = Math.max(minSize, fillWidth);
		this.fill.height = Math.max(minSize, fillHeight);
		this.fill.position.set(padding.left || 0, this.options.direction === "vertical" ? this.options.height - fillHeight - (padding.bottom || 0) : padding.top || 0);

		// 更新圆角遮罩
		this.updateRoundedMask(fillWidth, fillHeight);
	}

	// 支持圆角的遮罩绘制
	private updateRoundedMask(width: number, height: number) {
		const padding = this.options.fillPadding || {};
		const borderRadius = this.options.borderRadius || 0;

		this.fillMask.clear().roundRect(this.fill.x, this.fill.y, width, height, this.calculateActiveBorderRadius(borderRadius)).fill({ color: 0xff0000 });
	}

	// 动态计算有效圆角（防止圆角超过尺寸）
	private calculateActiveBorderRadius(radius: number): number {
		const minDimension = Math.min(this.fill.width, this.fill.height);
		return Math.min(radius, minDimension / 2);
	}

	private calculateFillSize(progress: number): [number, number] {
		const padding = this.options.fillPadding || {};

		if (this.options.direction === "horizontal") {
			const maxWidth = this.options.width - (padding.left || 0) - (padding.right || 0);
			return [maxWidth * progress, this.options.height - (padding.top || 0) - (padding.bottom || 0)];
		} else {
			const maxHeight = this.options.height - (padding.top || 0) - (padding.bottom || 0);
			return [this.options.width - (padding.left || 0) - (padding.right || 0), maxHeight * progress];
		}
	}

	override destroy() {
		this.tween?.kill();
		super.destroy({ children: true });
	}
}
