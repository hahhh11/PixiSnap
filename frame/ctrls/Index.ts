import { destroyWaiting } from './WaitingCtrl';
import SceneCtrl from './SceneCtrl';
import { destroyToast } from './ToastCtrl';
import { Modal } from '../views/Modal';
import { Scene } from '../views/Scene';
import { gsap } from 'gsap';
import ModalCtrl from './ModalCtrl';

export { showToast } from './ToastCtrl';

export * from './WaitingCtrl';
/**
 * 展示弹框
 * @param Modal 弹框类
 * @param data 数据
 */
export function showModal<T extends Modal>(Modal: new (...args: any) => T, data?: T['data']) {
	return ModalCtrl.instance.show(Modal, data);
}
/**
 * 返回一个Promise，回调时机在Modal里处理
 * @param Modal
 * @param data
 * @returns
 */
export function showPromiseModal<T extends Modal>(Modal: new (...args: any) => T, data?: T['data']) {
	const resModal = ModalCtrl.instance.show(Modal, data);
	return new Promise<Parameters<T['resolve']>[0]>((r) => {
		resModal.resolve = r;
	});
}

/**
 * 关闭所有弹框
 */
export const closeAllModals = () => {
	ModalCtrl.instance.closeAll();
};

/**
 * 关闭当前弹框
 */
export const closeCurrentModal = () => {
	ModalCtrl.instance.closeCurrent();
};

/**
 * 替换场景
 * @param scene
 * @param data
 */
export function changeScene<T extends Scene>(scene: new (...args: any) => T, data?: T['data']) {
	SceneCtrl.instance.change(scene, data);
}

/**
 * 获取当前场景
 */
export function getCurrentScene(): any {
	return SceneCtrl.instance.currentScene;
}
/**
 * 替换setTimeout  因为页面销毁时setTimeout不会停
 * 所以干脆用Tween的
 * @param {Function} callback
 * @param {number} time 毫秒计
 * @param {any} obj 挂载的主体，可选，如果传场景的节点，会跟随场景的destroy而移除，不传需要自己维护移除clearWait
 * @returns 返回用于clearWait的对象
 */
export function wait<T extends object>(callback: () => void, time: number, obj?: T): T {
	obj = obj || ({} as T);
	gsap.to(obj, {
		x: 100,
		delay: time / 1000,
		onComplete: callback,
	});
	return obj;
}
/**
 *
 * @param time 毫秒计
 * @param obj 挂载的主体，直接传场景的节点，伴随场景销毁就不会执行then后的逻辑
 * @returns promise
 */
export function waitAsync(time: number, obj: any) {
	return new Promise<void>((r) => {
		wait(r, time, obj);
	});
}
/**
 * 移除延时
 * @param obj wait的返回值
 */
export function clearWait(obj: any) {
	obj && gsap.killTweensOf(obj);
}

/**
 * 递归清除显示对象里面所有的Tween
 * @param obj
 * @param isRecursive 默认true,递归移除子级
 */
export function removeTweens(obj, isRecursive: boolean = true) {
	if (!obj) return;
	gsap.killTweensOf(obj);
	if (!isRecursive || !obj.children || !obj.children.length) return;
	obj.children.forEach((child) => {
		removeTweens(child);
	});
}

/**
 * 销毁方法
 */
export function destroyAllCtrls() {
	destroyToast();
	destroyWaiting();
	ModalCtrl.instance.destroy();
	SceneCtrl.instance.destroy();
}
