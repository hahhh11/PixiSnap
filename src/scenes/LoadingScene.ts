/*
 * @Author: 98Precent
 * @Date: 2025-03-31 09:59:19
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-03-31 17:48:12
 * @FilePath: /PixiSnap/src/scenes/LoadingScene.ts
 */
import { App } from "../App";
import { Scene } from "../core/views/Scene";
import { UI } from "../ui/UI";

export class LoadingScene extends Scene {
	get bandleName() {
		return ["loadingScene"];
	}

	async initUi() {
		this.addChild(await UI.img("bg", 0, 0, App.ins.designWidth, App.ins.designHeight));

		let bar = await UI.imageProgressBar({ fillTexture: "loading_fill", width: 1200 }, 0, App.ins.designHeight - 150);
		bar.x = (App.ins.designWidth - bar.width) >> 1;
		this.addChild(bar);
		bar.update(0.25)
			.then(() => {
				bar.update(0.5);
			})
			.then(() => {
				bar.update(0.75);
			})
			.then(() => {
				bar.update(1);
			});
	}
}
