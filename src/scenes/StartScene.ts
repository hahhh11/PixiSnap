import { Assets, Graphics, Sprite } from 'pixi.js';
import { Scene } from '../../frame/views/Scene';

export class StartScene extends Scene {
	groupName = [];

	async initUi() {
		let bg = new Graphics();
		bg.rect(0, 0, 1920, 1080).fill({ color: 0x333333, alpha: 1 });
		this.addChild(bg);

		// Load the bunny texture
		const texture = await Assets.load('https://pixijs.com/assets/bunny.png');

		// Create a bunny Sprite
		const bunny = new Sprite(texture);
		this.addChild(bunny);

		// Center the sprite's anchor point
		// bunny.anchor.set(0.5);

		// Move the sprite to the center of the screen
		// bunny.x = app.screen.width / 2;
		// bunny.y = app.screen.height / 2;
	}
}
