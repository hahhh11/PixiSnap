import { Container, Sprite, Text, TextStyle, NineSliceSprite, TextStyleOptions } from "pixi.js";
import { gsap } from "gsap";

type ButtonSprite = Sprite | NineSliceSprite;

interface ButtonOptions {
	upSprite: ButtonSprite;
	downSprite?: ButtonSprite;
	upIcon?: Sprite;
	upIconX?: number;
	upIconY?: number;
	downIconX?: number;
	downIconY?: number;
	downOffsetX?: number;
	downOffsetY?: number;
	text?: string;
	textStyle?: Partial<TextStyle>;
	animateScale?: number;
}

export class Button extends Container {
	private upSprite: ButtonSprite;
	private downSprite: ButtonSprite;
	private upIcon: ButtonSprite;
	private upIconX: number = 0;
	private upIconY: number = 0;
	private downIconX: number = 0;
	private downIconY: number = 0;
	private downOffsetX: number = 0;
	private downOffsetY: number = 0;
	private textElement: Text;
	private isPressed: boolean = false;
	private _enabled: boolean = true;

	constructor(options: ButtonOptions) {
		super();

		// 基础配置
		this.upSprite = options.upSprite;
		this.downSprite = options.downSprite || options.upSprite;
		this.upIcon = options.upIcon ?? null;
		this.upIconX = options.upIconX ?? 0;
		this.upIconY = options.upIconY ?? 0;
		this.downIconX = options.downIconX ?? 0;
		this.downIconY = options.downIconY ?? 0;
		this.downOffsetX = options.downOffsetX ?? 0;
		this.downOffsetY = options.downOffsetY ?? 0;
		this.interactive = true;
		this.cursor = "pointer";

		// 初始化默认纹理
		this.addChild(this.upSprite);

		if (this.upIcon) {
			this.upIcon.x = this.upIconX;
			this.upIcon.y = this.upIconY;
			this.addChild(this.upIcon);
		}

		// 初始化文本
		if (options.text) {
			let style: TextStyleOptions = {
				fill: 0xffffff,
				fontSize: 24,
				align: "center",
				...options.textStyle,
			};
			this.textElement = new Text({ text: options.text, style });
			this.centerText();
			this.addChild(this.textElement);
		}

		// 设置默认动画参数
		this.animateScale = options.animateScale ?? 0.95;

		// 绑定事件
		this.enableInteraction();
	}

	// 居中文本
	private centerText() {
		if (!this.textElement) return;

		this.textElement.anchor.set(0.5);
		this.textElement.position.set(this.width / 2, this.height / 2);
	}

	// 设置文本
	set text(value: string) {
		if (!this.textElement) return;
		this.textElement.text = value;
		this.centerText();
	}

	// 启用/禁用按钮
	set enabled(value: boolean) {
		this._enabled = value;
		this.interactive = value;
		this.alpha = value ? 1 : 0.6;
	}

	get enabled() {
		return this._enabled;
	}

	// 动画缩放比例
	set animateScale(value: number) {
		this.scale.set(1);
		gsap.killTweensOf(this.scale);
	}

	// 事件处理
	private enableInteraction() {
		this.on("pointerdown", this.onButtonDown)
			.on("pointerup", this.onButtonUp)
			.on("pointerupoutside", this.onButtonUp)
			.on("pointerover", this.onButtonOver)
			.on("pointerout", this.onButtonOut);
	}

	private onButtonDown = () => {
		if (!this.enabled) return;

		this.isPressed = true;
		this.removeChildren();
		this.downSprite.y = this.upSprite.x + this.downOffsetX;
		this.downSprite.y = this.upSprite.y + this.downOffsetY;
		this.addChild(this.downSprite);
		if (this.upIcon) {
			this.upIcon.x = this.downIconX;
			this.upIcon.y = this.downIconY;
			this.addChild(this.upIcon);
		}
		if (this.textElement) this.addChild(this.textElement);

		gsap.to(this.scale, {
			x: 0.95,
			y: 0.95,
			duration: 0.1,
			ease: "power2.out",
		});
	};

	private onButtonUp = () => {
		if (!this.enabled || !this.isPressed) return;

		this.isPressed = false;
		this.removeChildren();
		this.addChild(this.upSprite);
		if (this.upIcon) {
			this.upIcon.x = this.upIconX;
			this.upIcon.y = this.upIconY;
			this.addChild(this.upIcon);
		}
		if (this.textElement) this.addChild(this.textElement);

		gsap.to(this.scale, {
			x: 1,
			y: 1,
			duration: 0.2,
			ease: "elastic.out(1.2, 0.5)",
		});
	};

	private onButtonOver = () => {
		if (!this.enabled) return;

		gsap.to(this, {
			alpha: 0.9,
			duration: 0.2,
		});
	};

	private onButtonOut = () => {
		gsap.to(this, {
			alpha: 1,
			duration: 0.2,
		});
	};

	// 自动调整九宫格（如果使用NineSlicePlane）
	resize(width: number, height: number) {
		this.upSprite.width = width;
		this.upSprite.height = height;

		this.downSprite.width = width;
		this.downSprite.height = height;

		this.centerText();
	}
}
