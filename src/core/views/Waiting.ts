import { Application, Container, Graphics, Text, TextStyle, Ticker } from "pixi.js";
import { gameLayers } from "./layers";
import { App } from "../../App";
interface WaitingOptions {
	/** 背景颜色（默认半透明黑色） */
	backgroundColor?: number;
	/** 背景透明度（默认0.7） */
	backgroundAlpha?: number;
	/** 旋转元素的颜色（默认白色） */
	spinnerColor?: number;
	/** 提示文字样式 */
	textStyle?: TextStyle;
	/** 默认提示文字 */
	defaultText?: string;
	/** 旋转速度（弧度/帧，默认0.1） */
	rotationSpeed?: number;
	/** 旋转元素半径（默认30） */
	spinnerRadius?: number;
	/** 旋转元素线条宽度（默认4） */
	spinnerLineWidth?: number;
}

export class Waiting extends Container {
	private bg: Graphics;
	private spinner: Graphics;
	private text: Text;
	private options: Required<WaitingOptions>;
	private isShowing = false;

	constructor(options: WaitingOptions = {}) {
		super();
		// 合并默认选项
		this.options = {
			backgroundColor: 0xff0000,
			backgroundAlpha: 0,
			spinnerColor: 0xffffff,
			textStyle: new TextStyle({
				fill: 0xffffff,
				fontSize: 20,
				fontFamily: "Arial",
			}),
			defaultText: "Loading...",
			rotationSpeed: 0.1,
			spinnerRadius: 30,
			spinnerLineWidth: 4,
			...options,
		};

		// 创建容器
		this.visible = false;
		this.zIndex = 9999; // 确保在最上层

		// 创建背景
		const bg = (this.bg = new Graphics());
		bg.rect(0, 0, 100, 100); // 初始尺寸会被调整
		bg.fill({ color: this.options.backgroundColor, alpha: this.options.backgroundAlpha });
		this.addChild(bg);

		// 创建旋转指示器
		this.spinner = new Graphics();
		this.spinner.setStrokeStyle(this.options.spinnerLineWidth);
		this.spinner.arc(0, 0, this.options.spinnerRadius, 0, Math.PI * 1.5);
		this.spinner.fill({ color: this.options.spinnerColor });
		this.spinner.position.set(0, 0);
		this.addChild(this.spinner);

		// 创建文本
		this.text = new Text({ text: this.options.defaultText, style: this.options.textStyle });
		this.text.anchor.set(0);
		this.text.position.set(0, this.options.spinnerRadius + 40);
		this.addChild(this.text);

		// 更新位置和尺寸
		this.updateSize();
		this.center();

		// 注册动画
		Ticker.shared.add(this.update, this);
	}

	/**
	 * 显示等待指示器
	 * @param message 可选的自定义提示消息
	 */
	show(message?: string): void {
		if (message) {
			this.text.text = message;
		}
		this.visible = true;
		this.isShowing = true;
		this.updateSize();
		this.center();
	}

	/**
	 * 更新旋转动画
	 */
	private update(): void {
		if (this.isShowing) {
			this.spinner.rotation += this.options.rotationSpeed;
		}
	}

	/**
	 * 更新尺寸以适应屏幕
	 */
	private updateSize(): void {
		const bg = this.bg;
		bg.clear();
		bg.rect(0, 0, App._instance.designWidth, App._instance.designHeight);
		bg.fill({ color: this.options.backgroundColor, alpha: this.options.backgroundAlpha });
	}

	/**
	 * 居中显示
	 */
	private center(): void {
		this.position.set(0, 0);
		this.spinner.position.set((App.ins.designWidth - this.spinner.width) / 2, (App.ins.designHeight - this.spinner.height) / 2);
		this.text.position.set(this.spinner.x - this.text.width / 2, this.spinner.y + 40);
	}

	/**
	 * 销毁等待指示器
	 */
	destroy(): void {
		Ticker.shared.remove(this.update, this);
		this.destroy();
	}
}
