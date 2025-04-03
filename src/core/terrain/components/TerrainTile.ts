/*
 * @Author: 98Precent
 * @Date: 2025-04-02 17:14:45
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-04-03 18:23:17
 * @FilePath: /PixiSnap/src/core/terrain/components/TerrainTile.ts
 */
import { AnimatedSprite, Assets, Container, Rectangle, Sprite, Text, Texture } from "pixi.js";
import { TileType } from "./TileType";

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
		[1, 0], // 右
		[0, 1], // 下
		[-1, 0], // 左
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
		let bitString = "";

		// 仅遍历四方向邻接
		TerrainTile.neighbors.forEach(([dx, dy], i) => {
			const nx = x + dx;
			const ny = y + dy;
			const neighborType = grid[ny]?.[nx];
			console.log(neighborType, currentType);
			bitString += neighborType === currentType ? 1 : 0;
		});

		// 输出验证（应为 0-15 的整数）
		console.log("Correct Bitmask:", bitString);

		this.baseVisual.texture = this.calculateTexture(bitString);
	}

	private calculateTexture(bitString: string): Texture {
		// 将4位掩码映射到4x4的16种组合
		const index = this.maskToIndex(bitString);

		return this.terrainAtlas.textures[index];
	}

	private maskToIndex(bitmask: string): number {
		// const posMap = ["3*3左上", "3*3上", "3*3右上", "1*3上", "3*3左", "3*3中", "3*3右", "1*3中", "3*3左下", "3*3下", "3*3右下", "1*3下", "3*1左", "3*1中", "3*1右", "1*1独立"];
		const indexMap = {
			"0011": 0,
			"0111": 1,
			"0110": 3,
			"0010": 4,
			"1011": 5,
			"1111": 6,
			"1110": 7,
			"1010": 8,
			"1001": 9,
			"1101": 10,
			"1100": 11,
			"1000": 12,
			"0001": 13,
			"0101": 14,
			"0000": 15,
		};
		console.log(bitmask, indexMap[bitmask]);

		return indexMap[bitmask];
	}
}

//地形系统核心;
export class TerrainSystem extends Container {
	private grid: TileType[][] = [];
	private tileSize: number;

	constructor(private widthIdx: number, private heightIdx: number, tileSize: number = 64) {
		super();
		this.tileSize = tileSize;
		this.initTerrain();
	}

	private async initTerrain() {
		await this.initGrid();
		await this.initTiles();
	}

	private async initGrid() {
		for (let y = 0; y < this.heightIdx; y++) {
			this.grid[y] = [];
			for (let x = 0; x < this.widthIdx; x++) {
				this.grid[y][x] = TileType.Grass;
				this.addChild(await this.createTile(x, y, TileType.Grass));
			}
		}
	}

	private async initTiles() {
		for (let y = 0; y < this.heightIdx; y++) {
			for (let x = 0; x < this.widthIdx; x++) {
				(this.children[y * this.widthIdx + x] as TerrainTile).updateTexture(this.grid, x, y);
				// this.setTile(x, y, TileType.Grass);
			}
		}
	}

	private async createTile(x: number, y: number, type: TileType): Promise<TerrainTile> {
		let tileAssetsName = "";
		if (type === TileType.Grass) {
			tileAssetsName = "Tilemap_Grass";
		}
		let texture = await Assets.load(tileAssetsName);
		let terrainAtlas = new TextureAtlas(texture, 4, 4);
		const tile = new TerrainTile(terrainAtlas, type);
		tile.position.set(x * this.tileSize, y * this.tileSize);

		return tile;
	}

	public setTile(x: number, y: number, type: TileType) {
		this.grid[y][x] = type;
		// 根据临格决定自己用什么纹理
		// this.updateTexture(x, y);
		// this.updateNeighbors(x, y);
	}

	private updateNeighbors(x: number, y: number) {
		for (let dy = -1; dy <= 1; dy++) {
			for (let dx = -1; dx <= 1; dx++) {
				const nx = x + dx;
				const ny = y + dy;
				if (this.isValid(nx, ny)) {
					(this.children[ny * this.widthIdx + nx] as TerrainTile).updateTexture(this.grid, nx, ny);
				}
			}
		}
	}

	private isValid(x: number, y: number): boolean {
		return x >= 0 && y >= 0 && x < this.widthIdx && y < this.heightIdx;
	}
}
