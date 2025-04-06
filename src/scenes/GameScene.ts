/*
 * @Author: 98Precent
 * @Date: 2025-04-01 10:46:12
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-04-04 12:37:11
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
import { Button } from '../ui/componets/Button';

export class GameScene extends Scene {
	get bandleName(): string[] {
		return ['Terrain', 'Warrior', 'UI', 'Resources'];
	}

	gameContainer: Container;
	panels: Container;
	warrior: Character;
	settingBtn: Button;

	async initUi() {
		this.mask = this.addChild(UI.rect(0, 0, App.ins.designWidth, App.ins.designHeight));
		this.gameContainer = this.addChild(UI.container());
		this.panels = this.addChild(UI.container());

		this.enableMouseEvt(true);

		let terrainSystem = new TerrainSystem(33, 33, 64);
		this.gameContainer.addChild(terrainSystem);
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
		this.gameContainer.addChild(warrior);

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
		this.gameContainer.addChild(warrior2);

		// showModal(SettingModal);
		let trees = new Container();
		this.gameContainer.addChild(trees);
		for (let i = 0; i < 20; i++) {
			let tree = await UI.tree({ health: 100 }, GameUtils.randomFloat(192, 1920 - 192), GameUtils.randomFloat(192, 1080 - 192));
			trees.addChild(tree);
		}
		trees.children.sort((a, b) => a.y - b.y);

		let settingBtn = (this.settingBtn = this.panels.addChild(await UI.button('Button_Blue', 'Button_Blue_Pressed', { upIcon: 'Regular_02', upIconX: 0, upIconY: 0, downIconX: 0, downIconY: 9, downOffsetY: 4 })) as Button);
		settingBtn.x = 1920 - 100;
		settingBtn.y = 50;
		settingBtn.on('click', () => {
			showModal(SettingModal);
		});
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
