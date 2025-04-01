import { Assets, Graphics, NineSliceSprite, Sprite, Texture } from "pixi.js";
import { ImageProgressBar, ImageProgressBarOptions } from "./componets/ImageProgressBar";
import { SpriteSheetAnimator } from "../core/animations/SpriteSheetAnimator";
import { GameCharacter } from "../entities/characters/GameCharacter";
import { Button } from "./componets/Button";

/*
 * @Author: 98Precent
 * @Date: 2025-03-31 10:21:28
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-04-01 17:07:20
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

	static async nineSliceSprite(src, leftWidth = 0, rightWidth = 0, topHeight = 0, bottomHeight = 0, x = 0, y = 0, width?, height?) {
		let texture = await Texture.from(src);
		if (!texture) {
			texture = await Assets.load(src);
		}
		let sprite = new NineSliceSprite({ texture, leftWidth, rightWidth, topHeight, bottomHeight });
		if (width !== "undefined") {
			sprite.width = width;
		}
		if (height !== "undefined") {
			sprite.height = height;
		}
		sprite.position.set(x, y);

		return sprite;
	}

	static async button(upSrc, downSrc?, buttonOptions?) {
		let upTexture = await Texture.from(upSrc);
		if (!upTexture) {
			upTexture = await Assets.load(upSrc);
		}
		let upSprite = new NineSliceSprite(upTexture);
		let downSprite = null;
		if (downSrc) {
			let downTexture = await Texture.from(downSrc);
			if (!downTexture) {
				downTexture = await Assets.load(downSrc);
			}
			downSprite = new NineSliceSprite(downTexture);
		}
		let { upIcon, upIconX, upIconY, downIconX, downIconY, downOffsetX, downOffsetY } = buttonOptions;
		if (upIcon) {
			if (!(buttonOptions.upIcon instanceof NineSliceSprite || buttonOptions.upIcon instanceof Sprite)) {
				let texture = await Texture.from(buttonOptions.upIcon);
				if (!texture) {
					texture = await Assets.load(buttonOptions.upIcon);
				}
				buttonOptions.upIcon = new NineSliceSprite(texture);
			}
		}

		let button = new Button({
			upSprite,
			downSprite,
			upIcon: buttonOptions.upIcon,
			upIconX,
			upIconY,
			downIconX,
			downIconY,
			downOffsetX,
			downOffsetY,
			text: buttonOptions?.text,
			textStyle: buttonOptions?.textStyle,
		});
		return button;
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

	static async spriteSheetAnimator(config, x = 0, y = 0) {
		let ani = new SpriteSheetAnimator(config);
		config.resource && (await ani.load(config.resource));
		ani.position.set(x, y);

		return ani;
	}

	static async gameCharacter(config, x = 0, y = 0) {
		let character = new GameCharacter(config);
		await character.load(config.animationConfig.resource);
		character.position.set(x, y);
		return character;
	}
}
