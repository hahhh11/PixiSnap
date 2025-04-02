import { AnimatedSprite, Container, Sprite, Texture } from "pixi.js";
import { TileType } from "./TileType";
import { UI } from "../../../ui/UI";

const TileConfig = {
	[TileType.Grass]: {
		textures: ["terrain/grass.png"],
	},
};

export class Tile extends Container {
	type: TileType;
	baseVisual: Sprite | AnimatedSprite;
	decorations = [];
	public xIndex: number;
	public yIndex: number;
	chunkX;
	chunkY;

	constructor(type: TileType, x, y) {
		super();

		this.xIndex = x;
		this.yIndex = y;
		this.type = type;

		this.createBaseVisual();
	}

	private createBaseVisual() {
		let config = TileConfig[this.type];
		if (config.textures.length > 1) {
			this.baseVisual = new AnimatedSprite(config.textures.map((t) => Texture.from(t)));
			(this.baseVisual as AnimatedSprite).animationSpeed = config.props.animationSpeed || 0.1;
			(this.baseVisual as AnimatedSprite).play();
		} else {
			this.baseVisual = new Sprite(config.textures[0]);
		}

		this.baseVisual.anchor.set(0.5);
		this.addChild(this.baseVisual);
	}
}
