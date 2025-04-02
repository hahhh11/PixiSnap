/*
 * @Author: 98Precent
 * @Date: 2025-04-01 15:26:51
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-04-02 10:35:44
 * @FilePath: /PixiSnap/src/modals/SettingModal.ts
 */
import { App } from "../App";
import { Modal } from "../core/layout/views/Modal";
import { UI } from "../ui/UI";

export class SettingModal extends Modal {
	get bandleName() {
		return ["UI"];
	}

	bg;
	closeBtn;
	async initUi() {
		let modalBg = await UI.nineSliceSprite("Button_Blue_9Slides", 20, 20, 20, 40);
		modalBg.width = 1000;
		modalBg.height = 800;
		modalBg.position.set((1920 - 1000) >> 1, (1080 - 800) >> 1);
		this.addChild(modalBg);

		this.closeBtn = await UI.button("Button_Red", "Button_Red_Pressed", { upIcon: "Disable_01", upIconX: 0, upIconY: -4, downIconX: 0, downIconY: 5, downOffsetY: 5 });
		this.closeBtn.position.set(905 + (1920 - 1000) / 2, 170);
		this.addChild(this.closeBtn);
	}

	onClickCloseBtn = () => {
		this.hideModal();
	};

	initEvents(): void {
		super.initEvents();
		this.closeBtn.on("click", this.onClickCloseBtn);
		this.closeBtn.onpointerdown = this.onClickCloseBtn;
	}

	removeEvents(): void {
		super.removeEvents();
		this.closeBtn.off("click", this.onClickCloseBtn);
		this.closeBtn.onpointerdown = null;
	}
}
