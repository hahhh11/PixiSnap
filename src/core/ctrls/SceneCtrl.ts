/*
 * @Author: 98Precent
 * @Date: 2025-03-29 12:56:19
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-03-29 22:25:00
 * @FilePath: \PixiSnap\frame\ctrls\sceneCtrl.ts
 */
import { Scene } from '../views/Scene';
import { showToast } from './ToastCtrl';
import { showWaiting, hideWaiting } from './WaitingCtrl';
import { Container } from 'pixi.js';

export default class SceneCtrl {
	private _parent: Container | null;
	private _currentScene: Scene | null;

	private static _instance: SceneCtrl | null;
	static get instance() {
		return SceneCtrl._instance || (SceneCtrl._instance = new SceneCtrl());
	}
	init(parent: Container) {
		this._parent = parent;
	}

	change(cls: any, data?: any) {
		//如果是同一个场景，考虑是替换还是return
		// if (this._currentScene && this._currentScene instanceof cls) return;//new一个得了，playScene维护太蛋疼，到时看性能吧
		let scene: Scene = new cls(data);
		scene.visible = false;
		showWaiting();
		let preScene: Scene | null = this._currentScene;
		scene.onLoaded = () => {
			hideWaiting();
			scene.showAni(() => {
				if (preScene) preScene.destroy();
			});
			scene.visible = true;
		};
		//加载失败，继续用之前的场景，移除scene
		scene.onLoadError = () => {
			hideWaiting();
			showToast('资源加载失败');
			this._currentScene = preScene || null;
			this._parent?.removeChild(scene);
		};

		this._currentScene = scene;
		this._parent?.addChild(scene);
	}

	get currentScene() {
		return this._currentScene;
	}

	destroy() {
		SceneCtrl._instance = null;
		this._currentScene = null;
		this._parent = null;
	}
}
