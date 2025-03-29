/**
 * 全局事件控制器
 * 提供事件的注册、触发、移除等功能
 */
class GlobalEventController {
	private static instance: GlobalEventController;
	private events: Map<string, Set<Function>> = new Map();

	private constructor() {} // 私有构造函数确保单例

	/**
	 * 获取单例实例
	 */
	public static getInstance(): GlobalEventController {
		if (!GlobalEventController.instance) {
			GlobalEventController.instance = new GlobalEventController();
		}
		return GlobalEventController.instance;
	}

	/**
	 * 注册事件监听器
	 * @param eventName 事件名称
	 * @param callback 回调函数
	 * @param context 回调上下文(this)
	 */
	on(eventName: string, callback: Function, context?: any): void {
		if (!this.events.has(eventName)) {
			this.events.set(eventName, new Set());
		}

		const wrappedCallback = context ? callback.bind(context) : callback;
		this.events.get(eventName)!.add(wrappedCallback);
	}

	/**
	 * 一次性事件监听
	 * @param eventName 事件名称
	 * @param callback 回调函数
	 * @param context 回调上下文(this)
	 */
	once(eventName: string, callback: Function, context?: any): void {
		const onceWrapper = (...args: any[]) => {
			this.off(eventName, onceWrapper);
			callback.apply(context, args);
		};
		this.on(eventName, onceWrapper);
	}

	/**
	 * 移除事件监听器
	 * @param eventName 事件名称
	 * @param callback 回调函数
	 */
	off(eventName: string, callback?: Function): void {
		if (!this.events.has(eventName)) return;

		if (callback) {
			this.events.get(eventName)!.delete(callback);
		} else {
			this.events.get(eventName)!.clear();
		}
	}

	/**
	 * 触发事件
	 * @param eventName 事件名称
	 * @param args 传递给回调函数的参数
	 */
	emit(eventName: string, ...args: any[]): void {
		if (!this.events.has(eventName)) return;

		const callbacks = this.events.get(eventName)!;
		callbacks.forEach((callback) => {
			try {
				callback(...args);
			} catch (error) {
				console.error(`Error executing callback for event "${eventName}":`, error);
			}
		});
	}

	/**
	 * 清除所有事件监听器
	 */
	clearAll(): void {
		this.events.clear();
	}

	/**
	 * 检查事件是否有监听器
	 * @param eventName 事件名称
	 */
	hasListeners(eventName: string): boolean {
		return this.events.has(eventName) && this.events.get(eventName)!.size > 0;
	}
}

// 导出单例实例
export const globalEvents = GlobalEventController.getInstance();
