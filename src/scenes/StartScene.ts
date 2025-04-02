/*
 * @Author: 98Precent
 * @Date: 2025-03-31 09:59:19
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-04-01 16:58:04
 * @FilePath: /PixiSnap/src/scenes/StartScene.ts
 */
import { Assets, Graphics, Sprite } from "pixi.js";
import { Scene } from "../core/layout/views/Scene";
import { UI } from "../ui/UI";
import { hideWaiting, showWaiting } from "../core/layout/managers/Index";

export class StartScene extends Scene {
	get bandleName() {
		return ["common", "startScene"];
	}

	async initUi() {
		let bg = await UI.sprite("start_bg", 0, 0, 1920, 1080);
		this.addChild(bg);
		// showWaiting();
		// const bunny = await UI.sprite("https://pixijs.com/assets/bunny.png", 300, 200, 1000, 1000);
		// this.addChild(bunny);
	}
}
