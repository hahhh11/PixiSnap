
/*
 * @Author: 98Precent
 * @Date: 2025-03-29 13:09:29
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-03-29 13:35:40
 * @FilePath: \PixiSnap\frame\views\Modal.ts
 */
import { Module } from './Module';
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
		TWEEN.Tween.;
		Tween.get(this as Modal)
			.to({ y: oriY }, 500, Ease.quartOut)
			.call(() => {
				this.isShowing = false;
			});
	}

	hidePanel() {
		//至少移除的时候必须resolve了
		if (this.resolve) this.resolve(null);
		this.destroy();
	}
}
