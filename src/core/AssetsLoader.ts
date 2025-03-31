/*
 * @Author: 98Precent
 * @Date: 2025-03-31 11:58:25
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-03-31 12:04:27
 * @FilePath: /PixiSnap/src/core/AssetsLoader.ts
 */

import { Assets } from "pixi.js";

export class AssetLoader {
	private static _instance: AssetLoader;

	// 单例模式保证全局访问
	public static get ins(): AssetLoader {
		if (!this._instance) {
			this._instance = new AssetLoader();
		}
		return this._instance;
	}

	// 初始化资源清单
	async init(manifest: AssetManifest) {
		Assets.init({ manifest });
	}

	// 带进度回调的加载
	async loadBundle(bundleName: string, onProgress?: (percentage: number) => void) {
		Assets.loadBundle(bundleName, onProgress);
	}
}

// 类型定义文件：src/core/AssetLoader/types.ts
interface AssetManifest {
	bundles: Array<{
		name: string;
		assets: Array<{
			name: string;
			srcs: string;
		}>;
	}>;
}
