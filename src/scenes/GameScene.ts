/*
 * @Author: 98Precent
 * @Date: 2025-04-01 10:46:12
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-04-04 12:12:00
 * @FilePath: \PixiSnap\src\scenes\GameScene.ts
 */
import { Assets, Container, FederatedMouseEvent, Texture } from 'pixi.js';
import { App } from '../App';
import { Scene } from '../core/layout/views/Scene';
import { UI } from '../ui/UI';
import { Character } from '../game/entities/Character';
import { showModal } from '../core/layout/managers/Index';
import { SettingModal } from '../modals/SettingModal';
import { TerrainSystem, TerrainTile, TextureAtlas } from '../core/terrain/TerrainTile';
import { Tree } from '../game/entities/Tree';
import { GameUtils } from '../utils/GameUtils';

export class GameScene extends Scene {
	get bandleName(): string[] {
		return ['Terrain', 'Warrior', 'UI', 'Resources'];
	}
	warrior: Character;

	async initUi() {
		this.mask = this.addChild(UI.rect(0, 0, App.ins.designWidth, App.ins.designHeight));

		let bg = UI.rect(0, 0, App.ins.designWidth, App.ins.designHeight, 0xeeeeee);
		this.addChild(bg);
		this.enableMouseEvt(true);

		let terrainSystem = new TerrainSystem(33, 33, 64);
		this.addChild(terrainSystem);
		// console.log(terrainSystem);

		// terrainSystem.addChild(await UI.img("Tilemap_Grass")).scale.set(2, 2);

		let warrior = (this.warrior = await UI.character(
			{
				animationConfig: {
					resource: 'Warrior_Blue',
					frameWidth: 192,
					frameHeight: 192,
					globalSpeed: 0.3,
					animations: [
						{ name: 'idle', startFrame: 0, endFrame: 5, speed: 0.3, loop: false },
						{ name: 'walk', startFrame: 6, endFrame: 11 },
						{ name: 'attack1', startFrame: 12, endFrame: 17 },
						{ name: 'attack2', startFrame: 18, endFrame: 23 },
					],
				},
			},
			200,
			200
		));
		this.addChild(warrior);

		await UI.spriteSheetAnimator({
			resource: 'Warrior_Blue',
			frameWidth: 192,
			frameHeight: 192,
			globalSpeed: 0.3,
		});

		let warrior2 = await UI.character(
			{
				animationConfig: {
					resource: 'Warrior_Red',
					frameWidth: 192,
					frameHeight: 192,
					globalSpeed: 0.3,
					animations: [
						{ name: 'idle', startFrame: 0, endFrame: 5, speed: 0.3, loop: false },
						{ name: 'walk', startFrame: 6, endFrame: 11 },
						{ name: 'attack1', startFrame: 12, endFrame: 17 },
						{ name: 'attack2', startFrame: 18, endFrame: 23 },
					],
				},
			},
			200,
			500
		);
		this.addChild(warrior2);

		// showModal(SettingModal);
		let trees = new Container();
		this.addChild(trees);
		for (let i = 0; i < 20; i++) {
			let tree = await UI.tree({ health: 100 }, GameUtils.randomFloat(192, 1920 - 192), GameUtils.randomFloat(192, 1080 - 192));
			trees.addChild(tree);
		}
		trees.children.sort((a, b) => a.y - b.y);
	}

	initEvents(): void {
		super.initEvents();

		// this.on('pointerdown', (e) => {
		// 	console.log(e);
		// 	let attackName = ['attack1', 'attack2'][Math.round(Math.random())];
		// 	this.warrior.attack(attackName);
		// });
	}

	removeEvents() {
		super.removeEvents();
	}
}
