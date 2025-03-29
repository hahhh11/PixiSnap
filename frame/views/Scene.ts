/*
 * @Author: 98Precent
 * @Date: 2025-03-29 13:17:36
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-03-29 13:18:25
 * @FilePath: \PixiSnap\frame\views\Scene.ts
 */
import { Module } from './Module';
export class Scene extends Module {
	/**
	 * 显示动画
	 * 继承时注意，回调要加
	 * 因为这种动画基本原场景最好不消失
	 */
	showAni(callback: Function) {
		callback();
	}
	/**
	 * 统一更新方法
	 */
	updateScene() {}
}
