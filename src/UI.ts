import { Assets, Graphics, Sprite } from "pixi.js";

/*
 * @Author: 98Precent
 * @Date: 2025-03-31 10:21:28
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-03-31 11:46:21
 * @FilePath: /PixiSnap/src/UI.ts
 */
export class UI {
	rect(x, y, width, height, color = 0x00000, alpha = 1) {
		let rect = new Graphics();
		rect.rect(x, y, width, height);
		rect.fill({ color, alpha });
		return rect;
	}

	roundRect(x, y, width, height, radius = 0, color, alpha) {
		let roundRect = new Graphics();
		roundRect.roundRect(x, y, width, height, radius);
		roundRect.fill({ color, alpha });
		return roundRect;
	}

	async sprite(src, x, y, width?, height?) {
		let texture = await Assets.load(src);
		let sprite = new Sprite(texture);
		sprite.position.set(x, y);
		width !== undefined && (sprite.width = width);
		height !== undefined && (sprite.height = height);
		return sprite;
	}

	async img(src, x, y, width?, height?) {
		return await this.sprite(src, x, y, width, height);
	}
}
