import { Assets, Texture, Spritesheet, AnimatedSprite, Rectangle, TextureSource, Container, type SpritesheetData } from "pixi.js";

type AnimationConfig = {
	name: string;
	frames?: number[];
	startFrame?: number;
	endFrame?: number;
	speed?: number;
	loop?: boolean;
};

export type SpriteAnimationOptions = {
	frameWidth?: number;
	frameHeight?: number;
	globalSpeed?: number;
	globalLoop?: boolean;
	animations?: AnimationConfig[];
};

export class SpriteSheetAnimator extends Container {
	private animatedSprite: AnimatedSprite;
	private baseTexture: TextureSource | null = null;
	private animations = new Map<string, Texture[]>();
	private currentAnim: string | null = null;
	private config: SpriteAnimationOptions;

	constructor(config: SpriteAnimationOptions = {}) {
		super();

		this.config = {
			globalSpeed: 1,
			globalLoop: true,
			...config,
		};
		this.animatedSprite = new AnimatedSprite([new Texture()], true);
		this.addChild(this.animatedSprite);
	}

	async load(resource: string | { json: string; image: string }): Promise<this> {
		if (typeof resource === "object") {
			await this._loadSpriteSheet(resource);
		} else {
			await this._loadSingleImage(resource);
		}
		this._processAnimations();
		return this;
	}

	private async _loadSpriteSheet(resource: { json: string; image: string }) {
		const sheetData = await Assets.load<SpritesheetData>(resource.json);
		const sheet = new Spritesheet(await Assets.load(resource.image), sheetData);
		await sheet.parse();

		if (sheet.animations) {
			for (const [animName, textures] of Object.entries(sheet.animations)) {
				this.animations.set(animName, textures);
			}
		}

		const firstTexture = sheet.textures[Object.keys(sheet.textures)[0]];
		this.baseTexture = firstTexture.source;
	}

	private async _loadSingleImage(imageUrl: string) {
		const texture = await Assets.load<Texture>(imageUrl);
		this.baseTexture = texture.source;

		const { frameWidth, frameHeight } = this.config;
		if (!frameWidth || !frameHeight) return;

		const frames: Texture[] = [];
		for (let y = 0; y < texture.height; y += frameHeight) {
			for (let x = 0; x < texture.width; x += frameWidth) {
				frames.push(
					new Texture({
						source: this.baseTexture,
						frame: new Rectangle(x, y, frameWidth, frameHeight),
					})
				);
			}
		}
		this.animations.set("default", frames);
	}

	private _processAnimations() {
		this.config.animations?.forEach((config) => {
			const baseFrames = this.animations.get("default") || [];
			let frames: Texture[] = [];

			if (config.frames) {
				frames = config.frames.map((i) => baseFrames[i]);
			} else if (config.startFrame !== undefined && config.endFrame !== undefined) {
				frames = baseFrames.slice(config.startFrame, config.endFrame + 1);
			}

			if (frames.length > 0) {
				this.animations.set(config.name, frames);
			}
		});
	}

	addAnimation(name, frames) {
		if (frames > 0) {
			this.animations.set(name, frames);
		}
	}

	// 完整控制方法
	playAnimation(name: string, loop = true, onComplete?: () => void) {
		if (!this.animations.has(name)) {
			console.warn(`Animation ${name} not found`);
			return;
		}

		this.currentAnim = name;
		const textures = this.animations.get(name)!;
		this.animatedSprite.textures = textures;

		const config = this.config.animations?.find((a) => a.name === name);
		this.animatedSprite.animationSpeed = config?.speed ?? this.config.globalSpeed ?? 1;
		const finalLoop = loop ?? config?.loop ?? this.config.globalLoop;
		this.animatedSprite.loop = finalLoop;

		this.animatedSprite.gotoAndPlay(0);
		this.animatedSprite.onComplete = () => {
			onComplete && onComplete();
		};
	}

	play() {
		this.animatedSprite.play();
	}

	stop() {
		this.animatedSprite.stop();
	}

	gotoAndPlay(frame: number) {
		this.animatedSprite.gotoAndPlay(frame);
	}

	gotoAndStop(frame: number) {
		this.animatedSprite.gotoAndStop(frame);
	}

	get currentFrame(): number {
		return this.animatedSprite.currentFrame;
	}

	set speed(value: number) {
		this.animatedSprite.animationSpeed = value;
	}

	get speed(): number {
		return this.animatedSprite.animationSpeed;
	}

	set loop(value: boolean) {
		this.animatedSprite.loop = value;
	}

	get loop(): boolean {
		return this.animatedSprite.loop;
	}

	get isPlaying(): boolean {
		return this.animatedSprite.playing;
	}

	get animationNames(): string[] {
		return Array.from(this.animations.keys());
	}

	hasAnimation(key) {
		return this.animationNames.includes(key);
	}

	destroy(options?: { children?: boolean; texture?: boolean; baseTexture?: boolean }) {
		super.destroy(options);

		if (options?.texture && this.baseTexture) {
			this.baseTexture.destroy();
		}

		this.animatedSprite.destroy();
		this.animations.clear();
	}
}
