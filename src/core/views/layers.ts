import { Application, Container } from "pixi.js";
import SceneManager from "../managers/SceneManager";
import ModalManager from "../managers/ModalManager";
import { WaitingManager } from "../managers/WaitingManager";
import { ToastManager } from "../managers/ToastManager";

class Layers extends Container {
	private _bottomLayer: Container;
	private _sceneLayer: Container;
	private _popupLayer: Container;
	private _toastLayer: Container;
	private _topLayer: Container;
	private _shareLayer: Container;

	stage;
	canvas;
	renderer;

	init(app) {
		this.stage = app.stage;
		this.canvas = app.canvas;
		this.renderer = app.renderer;
		this.stage.addChild(this);
		var arr = ["_bottomLayer", "_sceneLayer", "_popupLayer", "_toastLayer", "_topLayer", "_shareLayer"];
		for (var i = 0; i < arr.length; i++) {
			this[arr[i]] = new Container();
			//有些时候，定宽的时候，部分layer置顶，部分居中，再处理
			//为了都置顶和置左，stage的方式永远居中视窗，要么改stage永远左上为00
			// this[arr[i]].y = this.stageOffsetY;
			//如果定宽这里没必要，肯定是0
			// this[arr[i]].x = this.stageOffsetX;//去掉，定高时就居中了
			this.addChild(this[arr[i]]);
		}
		//都以顶部适配
		// this.sceneLayer.y = this.stageOffsetY;
		// this.popupLayer.y = this.stageOffsetY;
		//都以底部适配
		// this.sceneLayer.y = -this.stageOffsetY;
		// this.popupLayer.y = -this.stageOffsetY;
		//这个因为psd弹框不规范
		// this.popupLayer.y -= 420 / 2;

		// this.shareLayer.y = -this.stageOffsetY;
		//初始化场景层级
		SceneManager.instance.init(this.sceneLayer);
		//初始化弹框层级
		ModalManager.instance.init(this.popupLayer);
		//初始化提示层级
		ToastManager.instance.init(this.toastLayer);
		// 初始化Waiting层级
		WaitingManager.instance.init(this.topLayer);
	}

	/**
	 * 底图所在层级，比如统一的背景
	 */
	get bottomLayer() {
		return this._bottomLayer;
	}
	/**
	 * 场景
	 */
	get sceneLayer() {
		return this._sceneLayer;
	}
	/**
	 * 弹框
	 */
	get popupLayer() {
		return this._popupLayer;
	}
	/**
	 * toast所在层级
	 */
	get toastLayer() {
		return this._toastLayer;
	}
	/**
	 * 顶层，比如统一标题栏等
	 */
	get topLayer() {
		return this._topLayer;
	}
	/**
	 * 分享引导层
	 */
	get shareLayer() {
		return this._shareLayer;
	}

	/**
	 * 适配方式x两边偏移的量，固定宽度x为0
	 */
	get stageOffsetX() {
		if (!this.stage) return 0;
		return this.stage.x;
	}
	get stageOffsetY() {
		if (!this.stage) return 0;
		return this.stage.y;
	}
}

export const gameLayers = new Layers();

//先执行，在淘宝小程序中重新进入会再次初始化
export function destroyLayers() {
	//所有层级移除，init会重新建
	gameLayers.removeChildren();
	//从父级stage移除自己，init会重新加
	if (gameLayers.parent) gameLayers.parent.removeChild(gameLayers);
}
