/*
 * @Author: 98Precent
 * @Date: 2025-04-01 10:46:12
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-04-01 16:58:13
 * @FilePath: /PixiSnap/src/scenes/GameScene.ts
 */
import { FederatedMouseEvent } from "pixi.js";
import { App } from "../App";
import { Scene } from "../core/layout/views/Scene";
import { UI } from "../ui/UI";
import { GameCharacter } from "../entities/characters/GameCharacter";
import { showModal } from "../core/layout/managers/Index";
import { SettingModal } from "../modals/SettingModal";

export class GameScene extends Scene {
	get bandleName(): string[] {
		return ["Terrain", "Warrior", "UI"];
	}
	warrior: GameCharacter;

	async initUi() {
		let bg = UI.rect(0, 0, App.ins.designWidth, App.ins.designHeight, 0xeeeeee);
		this.addChild(bg);
		this.enableMouseEvt(true);

		let warrior = (this.warrior = await UI.gameCharacter(
			{
				animationConfig: {
					resource: "Warrior_Blue",
					frameWidth: 192,
					frameHeight: 192,
					globalSpeed: 0.3,
					animations: [
						{ name: "idle", startFrame: 0, endFrame: 5, speed: 0.3, loop: false },
						{ name: "walk", startFrame: 6, endFrame: 11 },
						{ name: "attack1", startFrame: 12, endFrame: 17 },
						{ name: "attack2", startFrame: 18, endFrame: 23 },
					],
				},
			},
			200,
			200
		));
		this.addChild(warrior);

		await UI.spriteSheetAnimator({
			resource: "Warrior_Blue",
			frameWidth: 192,
			frameHeight: 192,
			globalSpeed: 0.3,
		});

		let warrior2 = await UI.gameCharacter(
			{
				animationConfig: {
					resource: "Warrior_Red",
					frameWidth: 192,
					frameHeight: 192,
					globalSpeed: 0.3,
					animations: [
						{ name: "idle", startFrame: 0, endFrame: 5, speed: 0.3, loop: false },
						{ name: "walk", startFrame: 6, endFrame: 11 },
						{ name: "attack1", startFrame: 12, endFrame: 17 },
						{ name: "attack2", startFrame: 18, endFrame: 23 },
					],
				},
			},
			200,
			500
		);
		this.addChild(warrior2);

		showModal(SettingModal);
	}

	initEvents(): void {
		super.initEvents();

		this.on("pointerdown", (e) => {
			console.log(e);
			let attackName = ["attack1", "attack2"][Math.round(Math.random())];
			this.warrior.attack(attackName);
		});
	}

	removeEvents() {
		super.removeEvents();
	}
}
