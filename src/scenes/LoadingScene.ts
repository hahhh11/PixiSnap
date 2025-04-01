/*
 * @Author: 98Precent
 * @Date: 2025-03-31 09:59:19
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-04-01 16:58:09
 * @FilePath: /PixiSnap/src/scenes/LoadingScene.ts
 */
import { Assets } from "pixi.js";
import { App } from "../App";
import { Scene } from "../core/views/Scene";
import { UI } from "../ui/UI";
import { changeScene, waitAsync } from "../core/managers/Index";
import { StartScene } from "./StartScene";
import { GameScene } from "./GameScene";

export class LoadingScene extends Scene {
	get bandleName() {
		return ["loadingScene"];
	}

	async initUi() {
		this.addChild(await UI.img("loading_bg", 0, 0, App.ins.designWidth, App.ins.designHeight));

		let bar = await UI.imageProgressBar({ fillTexture: "loading_fill", width: 1200 }, 0, App.ins.designHeight - 150);
		bar.x = (App.ins.designWidth - bar.width) >> 1;
		this.addChild(bar);
		await bar.update(0.25);
		await Assets.loadBundle("startScene");
		await Assets.loadBundle("UI");
		await Assets.loadBundle("Terrain");
		await bar.update(1);
		changeScene(GameScene, {});
	}
}
