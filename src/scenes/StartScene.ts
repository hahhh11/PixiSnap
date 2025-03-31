/*
 * @Author: 98Precent
 * @Date: 2025-03-31 09:59:19
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-03-31 17:32:44
 * @FilePath: /PixiSnap/src/scenes/StartScene.ts
 */
import { Assets, Graphics, Sprite } from "pixi.js";
import { Scene } from "../core/views/Scene";
import { UI } from "../ui/UI";
import { hideWaiting, showWaiting } from "../core/ctrls";

export class StartScene extends Scene {
	get bandleName() {
		return ["common"];
	}

	async initUi() {
		let bg = await UI.sprite("bg", 0, 0, 1920, 1080);
		this.addChild(bg);
		// showWaiting();
		// const bunny = await UI.sprite("https://pixijs.com/assets/bunny.png", 300, 200, 1000, 1000);
		// this.addChild(bunny);

		let bar = await UI.imageProgressBar({ fillTexture: "bg", width: 1600 }, 100, 100, 1);
		this.addChild(bar);

		bar.update(0.25)
			.then(() => bar.update(0.5))
			.then(() => bar.update(0.75))
			.then(() => bar.update(1));
	}
}
