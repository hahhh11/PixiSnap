import gsap from 'gsap';
import { Assets, Container } from 'pixi.js';

/**
 *
 */
export class Module extends Container {
	public data: any;
	constructor(data?: any) {
		super();
		this.data = data;
		this.init();
	}
	/**
	 * 初始化资源和皮肤
	 */
	private init() {
		this.preLoadAssets().then(
			() => {
				this.initUi();
				this.initEvents();
				this.onLoaded && this.onLoaded();
			},
			() => {
				this.onLoadError && this.onLoadError();
			}
		);
	}
	/**
	 * 提前加载的资源
	 */
	protected preLoadAssets() {
		try {
			return new Promise((resolve, reject) => {
				let bandleName = this.bandleName;
				if (bandleName && bandleName.length) {
					var arr: Promise<any>[] = [];
					for (var i = 0; i < bandleName.length; i++) {
						arr.push(Assets.loadBundle(bandleName[i]));
					}
					Promise.all(arr).then(resolve, reject);
				} else {
					resolve(null);
				}
			});
		} catch (err) {
			console.error('preLoadAssets >>> ', err);
		}
	}

	/**
	 * 初始化ui
	 * 子类修改
	 */
	protected initUi() {}

	/**
	 * 资源加载完成后执行，用于场景及弹框控制
	 */
	onLoaded: () => void;

	/**
	 * 资源加载失败时执行，用于场景及弹框控制
	 */
	onLoadError: () => void;

	/**
	 * 可以有多个组
	 */
	get bandleName(): string[] | null {
		return null;
	}

	/**
	 * 添加事件
	 */
	initEvents(): void {}

	/**
	 * 移除事件
	 */
	removeEvents(): void {}

	/**
	 * 鼠标事件
	 * @param enable
	 */
	protected enableMouseEvt(enable: boolean): void {
		// 处理交互
		this.interactive = enable;
		// 处理子元素的交互
		this.interactiveChildren = enable;
	}

	/**
	 * 延时防连点
	 * @param target
	 * @param {number} delay
	 */
	protected btnDelay(target, delay = 2000) {
		target.interactive = false;
		target.interactiveChildren = false;
		setTimeout(() => {
			target.interactive = true;
			target.interactiveChildren = true;
		}, delay);
	}

	public destroy(): void {
		//以防有些地方用了showAni
		gsap.killTweensOf(this);

		// this.data = null;//看情况吧，有时候hidePanel后用了data，注意，还是先去掉吧
		//移除事件
		this.removeEvents();
		//派发销毁事件，主要用于场景及弹框控制
		this.emit('onDestroy');
		super.destroy();
	}
}
