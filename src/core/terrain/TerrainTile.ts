/*
 * @Author: 98Precent
 * @Date: 2025-04-02 17:14:45
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-04-04 11:24:01
 * @FilePath: \PixiSnap\src\core\terrain\TerrainTile.ts
 */
import { AnimatedSprite, Assets, Container, NineSliceSprite, Rectangle, Sprite, Text, Texture } from 'pixi.js';
import { TileType } from './TileType';
import { TileConfig } from './TileConfig';
import { GameUtils } from '../../utils/GameUtils';

// 纹理加载器
export class TextureAtlas {
	private readonly tileSize: number;
	public textures: Texture[] = [];

	constructor(baseTexture: Texture, cols = 4, rows = 4) {
		this.tileSize = baseTexture.width / cols;

		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				let texture = new Texture({ source: baseTexture.source, frame: new Rectangle(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize) });
				this.textures.push(texture);
			}
		}
	}
}

// 2. 地形瓦片类
export class TerrainTile extends Container {
	type: TileType;
	baseVisual: Sprite | AnimatedSprite;
	terrainAtlas: TextureAtlas;
	static neighbors = [
		[0, -1], // 上
		[-1, 0], // 右
		[0, 1], // 下
		[1, 0], // 左
	];

	constructor(terrainAtlas, type) {
		super();
		this.terrainAtlas = terrainAtlas;
		this.type = type;
		this.baseVisual = new Sprite();
		this.addChild(this.baseVisual);
	}

	updateTexture(grid: TileType[][], x: number, y: number) {
		const currentType = grid[y][x];
		let bitString = '';

		// 仅遍历四方向邻接
		TerrainTile.neighbors.forEach(([dx, dy], i) => {
			const nx = x + dx;
			const ny = y + dy;
			const neighborType = grid[ny]?.[nx];
			bitString += neighborType === currentType ? 1 : 0;
		});

		// 输出验证
		// console.log('Correct Bitmask:', bitString);

		this.baseVisual.texture = this.calculateTexture(bitString);
	}

	private calculateTexture(bitString: string): Texture {
		// 将4位掩码映射到4x4的16种组合
		const index = this.maskToIndex(bitString);

		return this.terrainAtlas.textures[index];
	}

	private maskToIndex(bitString: string): number {
		// const posMap = ["3*3左上", "3*3上", "3*3右上", "1*3上", "3*3左", "3*3中", "3*3右", "1*3中", "3*3左下", "3*3下", "3*3右下", "1*3下", "3*1左", "3*1中", "3*1右", "1*1独立"];
		const indexMap = {
			'0011': 0,
			'0111': 1,
			'0110': 2,
			'0010': 3,
			'1011': 4,
			'1111': 5,
			'1110': 6,
			'1010': 7,
			'1001': 8,
			'1101': 9,
			'1100': 10,
			'1000': 11,
			'0001': 12,
			'0101': 13,
			'0100': 14,
			'0000': 15,
		};

		return indexMap[bitString];
	}
}

//地形系统核心;
export class TerrainSystem extends Container {
	private grid: TileType[][] = [];
	private tileSize: number;
	private bg: NineSliceSprite;
	private tilesContainer = new Container();

	constructor(private widthIdx: number, private heightIdx: number, tileSize: number = 64) {
		super();
		this.tileSize = tileSize;
		this.initTerrain();
	}

	private async initTerrain() {
		this.bg = this.addChild(new NineSliceSprite(await Assets.load('Tilemap_Water')));
		this.bg.width = this.widthIdx * this.tileSize;
		this.bg.height = this.heightIdx * this.tileSize;
		this.addChild(this.tilesContainer);
		await this.initGrid();
		await this.initTiles();
	}

	private async initGrid() {
		for (let y = 0; y < this.heightIdx; y++) {
			this.grid[y] = [];
			for (let x = 0; x < this.widthIdx; x++) {
				let type = [TileType.Grass, TileType.Straw][GameUtils.randomInt(0, 1)];
				this.grid[y][x] = type;
				this.tilesContainer.addChild(await this.createTile(x, y, type));
			}
		}
	}

	private async initTiles() {
		for (let y = 0; y < this.heightIdx; y++) {
			for (let x = 0; x < this.widthIdx; x++) {
				(this.tilesContainer.children[y * this.widthIdx + x] as TerrainTile).updateTexture(this.grid, x, y);
				// this.setTile(x, y, TileType.Grass);
			}
		}
	}

	private async createTile(x: number, y: number, type: TileType): Promise<TerrainTile> {
		let { name, splitX, splitY } = TileConfig[type];

		let texture = await Assets.load(name);
		let terrainAtlas = new TextureAtlas(texture, splitX, splitY);
		const tile = new TerrainTile(terrainAtlas, type);
		tile.position.set(x * this.tileSize, y * this.tileSize);

		return tile;
	}

	public setTile(x: number, y: number, type: TileType) {
		this.grid[y][x] = type;
		this.updateNeighbors(x, y);
	}

	private updateNeighbors(x: number, y: number) {
		for (let dy = -1; dy <= 1; dy++) {
			for (let dx = -1; dx <= 1; dx++) {
				const nx = x + dx;
				const ny = y + dy;
				if (this.isValid(nx, ny)) {
					(this.tilesContainer.children[ny * this.widthIdx + nx] as TerrainTile).updateTexture(this.grid, nx, ny);
				}
			}
		}
	}

	private isValid(x: number, y: number): boolean {
		return x >= 0 && y >= 0 && x < this.widthIdx && y < this.heightIdx;
	}
}
