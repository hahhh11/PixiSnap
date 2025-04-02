import { Application, Container, Graphics, Text, TextStyle } from "pixi.js";
import { gsap } from "gsap";
import { Toast, ToastOptions } from "../views/Toast";

export class ToastManager {
	private toast?: Toast;
	private _parent: Container | null;

	private static _instance: ToastManager | null;
	static get instance() {
		return ToastManager._instance || (ToastManager._instance = new ToastManager());
	}

	init(parent: Container, options?: ToastOptions) {
		this._parent = parent;
		this.toast = new Toast(options);
	}

	showToast(message: string, duration?: number) {
		if (!this.toast) {
			console.warn("ToastManager not initialized. Call init() first.");
			return;
		}

		if (!this.toast.parent && this._parent) {
			this._parent.addChild(this.toast);
		}

		this.toast.show(message, duration);
	}

	hideToast() {
		if (this.toast) {
			this.toast.hide();
		}
	}

	hideToastImmediately() {
		if (this.toast) {
			this.toast.hideImmediately();
		}
	}

	destroy() {
		if (this.toast) {
			this.toast.destroy();
			this.toast = undefined;
		}
		ToastManager._instance = null;
	}
}

// 快捷方法
export const showToast = (message: string, duration?: number) => ToastManager.instance.showToast(message, duration);
export const hideToast = () => ToastManager.instance.hideToast();
export const hideToastImmediately = () => ToastManager.instance.hideToastImmediately();
export const destroyToast = () => ToastManager.instance.destroy();
