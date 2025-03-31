import { Container, Graphics, Text } from 'pixi.js';
import { gameLayers } from './layers';

export class Toast extends Container {
	msg: Text | null;
	bg: Graphics | null;
	PADDING = 40;
	constructor() {
		super();
		this.interactive = false;
		this.interactiveChildren = false;
		this.bg = new Graphics();
		this.addChild(this.bg);
		this.msg = new Text();
		this.addChild(this.msg);
	}
	/**
	 * 显示时调用
	 * @param msg
	 */
	show(message: string, duration = 2) {
		this.visible = false;
		if (!this.msg) {
			this.msg = new Text();
		}
		if (!this.bg) {
			this.bg = new Graphics();
		}
		this.msg.text = message;
		this.msg.anchor.set(0.5);

		this.bg
			.clear()
			.fill({ color: 0x333333, alpha: 0.8 })
			.roundRect(-this.msg.width / 2 - 20, -this.msg.height / 2 - 10, this.msg.width + 40, this.msg.height + 20, 10);

		this.position.set(gameLayers.canvas.width / 2, gameLayers.canvas.height * 0.8);

		this.visible = true;
		this.alpha = 0;
	}

	destroy() {
		gsap.killTweensOf(this);
		super.destroy();
		this.msg = null;
		this.bg = null;
	}
}
