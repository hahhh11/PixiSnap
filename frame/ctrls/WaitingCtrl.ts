import { Waiting } from '../views/Waiting';
import { gameLayers } from '../views/layers';
import { Application, Container, Graphics, Text, TextStyle, Ticker } from 'pixi.js';

export class WaitingCtrl {
	private waiting?: Waiting;
	private _parent: Container | null;

	private static _instance: WaitingCtrl | null;
	static get instance() {
		return WaitingCtrl._instance || (WaitingCtrl._instance = new WaitingCtrl());
	}

	init(parent: Container) {
		this._parent = parent;
		this.waiting = new Waiting({
			// 可以在这里传入自定义配置
			backgroundColor: 0x333333,
			backgroundAlpha: 0.8,
		});
	}

	showWaiting(message) {
		if (!this.waiting) {
			console.warn('WaitingCtrl not initialized. Call init() first.');
			return;
		}
		this._parent?.addChild(this.waiting);
		this.waiting.show(message);
	}

	hideWaiting() {
		if (this.waiting && WaitingCtrl.instance._parent) {
			WaitingCtrl.instance._parent.removeChild(this.waiting);
		}
	}

	destroy() {
		if (this.waiting) {
			this.waiting.destroy();
			this.waiting = undefined;
		}
		WaitingCtrl._instance = null;
	}
}

export const showWaiting = (message?: string) => WaitingCtrl.instance.showWaiting(message);
export const hideWaiting = () => WaitingCtrl.instance.hideWaiting();
export const destroyWaiting = () => WaitingCtrl.instance.destroy();
