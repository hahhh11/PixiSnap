import { Application, ApplicationOptions, AssetInitOptions, Assets, Container, Point, PointData } from "pixi.js";
import { gameLayers } from "./core/views/layers";
import { changeScene } from "./core/ctrls";
import { StartScene } from "./scenes/StartScene";
import manifest from "./assets/manifest";
export { gsap } from "gsap";

interface AppOptions extends ApplicationOptions {
	designWidth?: number;
	designHeight?: number;
	scaleMode?: "fit" | "fill" | "fixed-width" | "fixed-height";
	maxScale?: number;
	minScale?: number;
}

export const Preload = async () => {
	const initOptions: AssetInitOptions = {
		basePath: "./src",
	};

	await Assets.init(initOptions);
	for (let i = 0; i < manifest.bundles.length; i++) {
		Assets.addBundle(manifest.bundles[i].name, manifest.bundles[i].assets);
	}
	// 优先加载通用资源
	await Assets.loadBundle("common");
};

export class App extends Application {
	public designWidth: number;
	public designHeight: number;
	private scaleMode: string;
	private maxScale?: number;
	private minScale?: number;
	private resizeObserver: ResizeObserver;
	public gameContainer: Container;

	// 静态实例引用
	static _instance: App;

	public static get ins(): App {
		return App._instance;
	}

	async init(options: AppOptions) {
		if (App._instance) return; // 防止重复初始化

		const mergedOptions = {
			autoDensity: true,
			background: "#111111",
			resolution: window.devicePixelRatio || 1,
			...options,
		};

		await super.init(mergedOptions);

		App._instance = this;

		// 初始化设计尺寸和适配参数
		this.designWidth = options.designWidth || 1920;
		this.designHeight = options.designHeight || 1080;
		this.scaleMode = options.scaleMode || "fixed-height";
		this.maxScale = options.maxScale;
		this.minScale = options.minScale;

		// 创建游戏内容容器
		gameLayers.init(this);

		// 初始化适配
		this.setupAdaptation();

		// 预加载
		await Preload();

		changeScene(StartScene, {});
	}

	private setupAdaptation() {
		// 初始适配
		this.updateLayout();

		// 使用ResizeObserver监听尺寸变化
		this.resizeObserver = new ResizeObserver(() => {
			this.updateLayout();
		});
		this.resizeObserver.observe(this.canvas as HTMLCanvasElement);

		// 如果存在父元素，也监听父元素变化
		if (this.canvas.parentElement) {
			this.resizeObserver.observe(this.canvas.parentElement);
		}
	}

	public updateLayout() {
		const canvas = this.canvas as HTMLCanvasElement;
		const screenWidth = canvas.clientWidth;
		const screenHeight = canvas.clientHeight;

		// 计算缩放比例
		let scaleX = screenWidth / this.designWidth;
		let scaleY = screenHeight / this.designHeight;
		let scale = 1;

		switch (this.scaleMode) {
			case "fit":
				scale = Math.min(scaleX, scaleY);
				break;
			case "fill":
				scale = Math.max(scaleX, scaleY);
				break;
			case "fixed-width":
				scale = scaleX;
				break;
			case "fixed-height":
				scale = scaleY;
				break;
		}

		// 应用缩放限制
		if (this.maxScale !== undefined) {
			scale = Math.min(scale, this.maxScale);
		}
		if (this.minScale !== undefined) {
			scale = Math.max(scale, this.minScale);
		}

		// 更新游戏容器
		gameLayers.scale.set(scale);
		gameLayers.position.set((screenWidth - this.designWidth * scale) / 2, (screenHeight - this.designHeight * scale) / 2);

		// 派发自定义事件
		this.stage.emit("resize", { scale, screenWidth, screenHeight });
	}

	public destroy() {
		// 清理ResizeObserver
		this.resizeObserver.disconnect();
		super.destroy();
	}

	// 坐标转换方法
	public screenToWorld(point: PointData): Point {
		return this.gameContainer.toLocal(point);
	}

	public worldToScreen(point: PointData): Point {
		return this.gameContainer.toGlobal(point);
	}
}
