import { Application, Container, Graphics, Text, TextStyle } from "pixi.js";
import { gameLayers } from "./layers";

export interface ToastOptions {
	/** 背景颜色（默认深灰色） */
	backgroundColor?: number;
	/** 背景透明度（默认0.8） */
	backgroundAlpha?: number;
	/** 文字颜色（默认白色） */
	textColor?: number;
	/** 文字样式 */
	textStyle?: TextStyle;
	/** 默认显示时间（毫秒，默认3000） */
	duration?: number;
	/** 圆角半径（默认8） */
	cornerRadius?: number;
	/** 内边距（默认10） */
	padding?: number;
	/** 动画持续时间（毫秒，默认300） */
	animationDuration?: number;
	/** 垂直位置（默认底部） */
	verticalPosition?: "top" | "center" | "bottom";
	/** 水平位置（默认居中） */
	horizontalPosition?: "left" | "center" | "right";
	/** 垂直偏移量（默认50） */
	offsetY?: number;
}

export class Toast extends Container {
	private app: Application;
	private background: Graphics;
	private text: Text;
	private options: Required<ToastOptions>;
	private isShowing = false;
	private timeoutId?: number;

	constructor(options: ToastOptions = {}) {
		super();

		// 合并默认选项
		this.options = {
			backgroundColor: 0x333333,
			backgroundAlpha: 0.8,
			textColor: 0xffffff,
			textStyle: new TextStyle({
				fill: 0xffffff,
				fontSize: 16,
				fontFamily: "Arial",
				wordWrap: true,
				wordWrapWidth: 300,
				breakWords: true,
			}),
			duration: 3000,
			cornerRadius: 8,
			padding: 10,
			animationDuration: 300,
			verticalPosition: "bottom",
			horizontalPosition: "center",
			offsetY: 50,
			...options,
		};

		this.visible = false;
		this.zIndex = 9998; // 确保在最上层
		this.alpha = 0; // 初始透明

		// 创建背景
		this.background = new Graphics();
		this.addChild(this.background);

		// 创建文本
		this.text = new Text({ text: "", style: this.options.textStyle });
		this.text.anchor.set(0.5);
		this.addChild(this.text);
	}

	/**
	 * 显示Toast
	 * @param message 提示消息
	 * @param duration 可选的自定义显示时间
	 */
	show(message: string, duration?: number): void {
		if (this.isShowing) {
			this.hideImmediately();
		}

		this.text.text = message;
		this.updateSize();
		this.positionToast();

		this.visible = true;
		this.isShowing = true;

		// 显示动画
		gsap.killTweensOf(this);
		gsap.to(this, {
			alpha: 1,
			duration: this.options.animationDuration / 1000,
			ease: "power2.out",
		});

		// 设置自动隐藏
		const displayDuration = duration ?? this.options.duration;
		this.timeoutId = window.setTimeout(() => {
			this.hide();
		}, displayDuration);
	}

	/**
	 * 隐藏Toast（带动画）
	 */
	hide(): void {
		if (!this.isShowing) return;

		gsap.killTweensOf(this);
		gsap.to(this, {
			alpha: 0,
			duration: this.options.animationDuration / 1000,
			ease: "power2.in",
			onComplete: () => {
				this.hideImmediately();
			},
		});
	}

	/**
	 * 立即隐藏Toast（无动画）
	 */
	hideImmediately(): void {
		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
			this.timeoutId = undefined;
		}

		this.visible = false;
		this.isShowing = false;
		this.alpha = 0;

		if (this.parent) {
			this.parent.removeChild(this);
		}
	}

	/**
	 * 更新尺寸以适应文本内容
	 */
	private updateSize(): void {
		// 计算文本尺寸
		const textWidth = this.text.width;
		const textHeight = this.text.height;

		// 计算背景尺寸
		const bgWidth = (this.width = textWidth + this.options.padding * 2);
		const bgHeight = (this.height = textHeight + this.options.padding * 2);

		// 重绘背景
		this.background.clear();
		this.background.fill({ color: this.options.backgroundColor, alpha: this.options.backgroundAlpha });
		this.background.roundRect(-bgWidth / 2, -bgHeight / 2, bgWidth, bgHeight, this.options.cornerRadius);
	}

	/**
	 * 定位Toast
	 */
	private positionToast(): void {
		if (!this.app) return;

		let x = 0;
		let y = 0;

		// 水平定位
		switch (this.options.horizontalPosition) {
			case "left":
				x = this.width / 2 + this.options.padding;
				break;
			case "right":
				x = this.app.screen.width - this.width / 2 - this.options.padding;
				break;
			case "center":
			default:
				x = this.app.screen.width / 2;
				break;
		}

		// 垂直定位
		switch (this.options.verticalPosition) {
			case "top":
				y = this.height / 2 + this.options.offsetY;
				break;
			case "center":
				y = this.app.screen.height / 2;
				break;
			case "bottom":
			default:
				y = this.app.screen.height - this.height / 2 - this.options.offsetY;
				break;
		}

		this.position.set(x, y);
	}

	/**
	 * 销毁Toast
	 */
	destroy(): void {
		this.hideImmediately();
		super.destroy();
	}
}
