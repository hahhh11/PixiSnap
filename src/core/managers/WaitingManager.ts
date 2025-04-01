/*
 * @Author: 98Precent
 * @Date: 2025-03-31 09:59:19
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-04-01 12:45:35
 * @FilePath: /PixiSnap/src/core/manager/WaitingManager.ts
 */
import { Waiting } from "../views/Waiting";
import { gameLayers } from "../views/layers";
import { Application, Container, Graphics, Text, TextStyle, Ticker } from "pixi.js";

export class WaitingManager {
	private waiting?: Waiting;
	private _parent: Container | null;

	private static _instance: WaitingManager | null;
	static get instance() {
		return WaitingManager._instance || (WaitingManager._instance = new WaitingManager());
	}

	init(parent: Container) {
		this._parent = parent;
		this.waiting = new Waiting({
			// 可以在这里传入自定义配置
			backgroundColor: 0x000000,
			backgroundAlpha: 0.5,
		});
	}

	showWaiting(message) {
		if (!this.waiting) {
			console.warn("WaitingManager not initialized. Call init() first.");
			return;
		}
		this._parent?.addChild(this.waiting);
		this.waiting.show(message);
	}

	hideWaiting() {
		if (this.waiting && WaitingManager.instance._parent) {
			WaitingManager.instance._parent.removeChild(this.waiting);
		}
	}

	destroy() {
		if (this.waiting) {
			this.waiting.destroy();
			this.waiting = undefined;
		}
		WaitingManager._instance = null;
	}
}

export const showWaiting = (message?: string) => WaitingManager.instance.showWaiting(message);
export const hideWaiting = () => WaitingManager.instance.hideWaiting();
export const destroyWaiting = () => WaitingManager.instance.destroy();
