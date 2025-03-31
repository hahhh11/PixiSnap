import { Assets, Graphics, Sprite, Texture } from "pixi.js";
import { ImageProgressBar, ImageProgressBarOptions } from "./componets/ImageProgressBar";

/*
 * @Author: 98Precent
 * @Date: 2025-03-31 10:21:28
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-03-31 17:25:05
 * @FilePath: /PixiSnap/src/ui/UI.ts
 */
export class UI {
	static rect(x, y, width, height, color = 0x00000, alpha = 1) {
		let rect = new Graphics();
		rect.rect(x, y, width, height);
		rect.fill({ color, alpha });
		return rect;
	}

	static roundRect(x, y, width, height, radius = 0, color, alpha) {
		let roundRect = new Graphics();
		roundRect.roundRect(x, y, width, height, radius);
		roundRect.fill({ color, alpha });
		return roundRect;
	}

	static async sprite(src, x = 0, y = 0, width?, height?) {
		let texture = await Texture.from(src);
		if (!texture) {
			texture = await Assets.load(src);
		}
		let sprite = new Sprite(texture);
		sprite.position.set(x, y);
		width !== undefined && (sprite.width = width);
		height !== undefined && (sprite.height = height);
		return sprite;
	}

	static async img(src, x = 0, y = 0, width?, height?) {
		return await this.sprite(src, x, y, width, height);
	}

	static async imageProgressBar(
		options: { fillTexture: Texture | string; width?: number; height?: number; [key: string]: any },
		x = 0,
		y = 0,
		value = 0
	): Promise<ImageProgressBar> {
		const texture = typeof options.fillTexture === "string" ? await Texture.from(options.fillTexture) : options.fillTexture;

		// 自动获取纹理尺寸作为默认值
		const finalOptions = {
			width: texture.orig.width,
			height: texture.orig.height,
			...options,
		};
		let bar = new ImageProgressBar(finalOptions);
		bar.position.set(x, y);
		bar.update(value);

		return bar;
	}
}
