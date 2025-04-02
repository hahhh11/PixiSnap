/*
 * @Author: 98Precent
 * @Date: 2025-03-29 13:09:29
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-04-01 17:12:59
 * @FilePath: /PixiSnap/src/core/views/Modal.ts
 */
import gsap from "gsap";
import { Module } from "./Module";
/**
 * 模态框
 */
export class Modal extends Module {
	resolve: (res: any) => void = null;
	protected isShowing: boolean;

	showAni() {
		if (this.isShowing) return;
		this.isShowing = true;
		let oriY = this.y || 0;
		this.y = -200;
		gsap.killTweensOf(this as Modal);
		gsap.to(this, {
			y: oriY,
			duration: 0.5, // 500ms → 0.5s
			ease: "quart.out", // Ease.quartOut → "quart.out"
			onComplete: () => {
				this.isShowing = false;
			},
		});
	}

	hideModal() {
		//至少移除的时候必须resolve了
		if (this.resolve) this.resolve(null);
		this.destroy();
	}
}
