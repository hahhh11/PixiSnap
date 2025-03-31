import { Modal } from '../views/Modal';
import { gameLayers } from '../views/layers';
import { showWaiting, hideWaiting } from './WaitingCtrl';
import { showToast } from './ToastCtrl';
import { Container, Graphics } from 'pixi.js';

export default class ModalCtrl {
	/**
	 * 父级容器
	 */
	private _parent: Container | null;
	/**
	 * 半透明黑色背景
	 */
	private _bg: Graphics | null;
	/**
	 * 所有的弹框
	 */
	private stacks: Modal[] | null = [];

	private static _instance: ModalCtrl | null;
	static get instance() {
		return ModalCtrl._instance || (ModalCtrl._instance = new ModalCtrl());
	}

	init(parent: Container) {
		this._parent = parent;
		let bg = new Graphics(); //Shape();
		bg.fill({ color: 0 });
		bg.rect(
			//引用适配
			gameLayers.stageOffsetX - parent.x,
			gameLayers.stageOffsetY - parent.y,
			gameLayers.renderer.width,
			gameLayers.renderer.height
		);
		// bg.hitTestByPixel = false;
		bg.visible = false;
		this._parent.addChild(bg);
		this._bg = bg;
	}

	/**
	 * 关闭所有弹框
	 */
	closeAll() {
		this.stacks && this.stacks.forEach((e) => e.hidePanel());
	}

	show<T extends Modal>(cls: new (...args: any) => T, data?: T['data']): T {
		showWaiting();
		const modal: T = new cls(data);
		this.add(modal);
		this.stacks && this.stacks.push(modal);
		modal.onLoaded = () => {
			hideWaiting();
			this.updateView(false); //这里更新不显示动画先，自行判断是否显示
			//如果是最后一个才显示动画
			if (modal.visible) modal.showAni();
		};
		//资源加载失败时
		modal.onLoadError = () => {
			hideWaiting();
			showToast('资源加载失败');
			modal.off('onDestroy', this.onModalHide, this);
			this.remove(modal);
		};
		return modal;
	}
	private bgAni: 'hide' | 'show';
	private updateView(showModalAni: boolean = true) {
		if (!this.stacks || !this._bg || !this._parent) {
			return;
		}
		//没有弹框的时候
		if (!this.stacks.length) {
			// this._bg.visible = false;
			// this._current = null;
			// this._parent.visible = false;
			if (this._bg.visible) {
				//原先背景存在时，待测试
				this.bgAni = 'hide';
				gsap.killTweensOf(this._bg);
				gsap.to(this._bg, {
					alpha: 0,
					duration: 0.2, // 200ms = 0.2s
					ease: 'power2.out', // GSAP中的power2.out相当于cubicOut
					onComplete: () => {
						this._bg && (this._bg.visible = false);
						this._current = null;
						this._parent && (this._parent.visible = false);
					},
				});
			}
		} else {
			//显示弹框层
			this._parent.visible = true;
			if (this.bgAni == 'hide') {
				//如果正在执行蒙层消失动画，
				this.bgAni = 'show';
				gsap.killTweensOf(this._bg);
				this._bg.alpha = 0.7;
			}
			//如果首次出现弹框，加个动画
			if (this._bg.visible === false) {
				this._bg.visible = true;
				this._bg.alpha = 0;
				gsap.to(this._bg, {
					alpha: 0.7,
					duration: 0.2, // 200ms = 0.2秒
					ease: 'power2.out', // 相当于TweenJS的Ease.cubicOut
				});
			}
		}

		for (let i = 0; i < this.stacks.length; i++) {
			if (i < this.stacks.length - 1) {
				this.stacks[i].visible = false;
			} else {
				this.stacks[i].visible = true;
				if (showModalAni) this.stacks[i].showAni();
				this._current = this.stacks[i];
			}
		}
	}

	/**
	 * 添加进父级并添加事件
	 * @param modal
	 */
	private add(modal: Modal) {
		this._parent && this._parent.addChild(modal);
		modal.on('onDestroy', this.onModalHide, this);
	}

	/**
	 * 移除
	 * @param modal
	 */
	private remove(modal: Modal) {
		if (!this.stacks || !this._parent) {
			return;
		}
		this._parent.removeChild(modal);
		this.stacks = this.stacks.filter((e) => e != modal);
	}

	/**
	 * 弹框移除时执行
	 * @param e
	 */
	private onModalHide(e: Event) {
		const modal = e.target as Modal;
		modal.off('onDestroy', this.onModalHide, this);
		this.remove(modal);
		this.updateView();
	}

	//当前弹框
	private _current: Modal | null;

	/**
	 * 关闭当前弹框
	 */
	closeCurrent() {
		if (this._current) {
			this._current.hidePanel();
		}
	}

	destroy() {
		ModalCtrl._instance = null;
		this.stacks = null;
		this._current = null;
		this._parent = null;
		gsap.killTweensOf(this._bg);
		this._bg = null;
	}
}
