/*
 * @Author: 98Precent
 * @Date: 2025-04-02 17:14:45
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-04-06 09:32:30
 * @FilePath: \PixiSnap\src\core\terrain\TerrainTile.ts
 */
import { AnimatedSprite, Assets, Container, NineSliceSprite, Rectangle, Sprite, Text, Texture } from 'pixi.js';
import { TileType } from './TileType';
import { TileConfig } from './TileConfig';
import { GameUtils } from '../../utils/GameUtils';
import { SpriteSheetAnimator } from '../animations/SpriteSheetAnimator';

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

	async updateTexture(grid: TileType[][], x: number, y: number) {
		const currentType = grid[y][x];
		let bitString = '';
		let wave = false;
		// 仅遍历四方向邻接
		TerrainTile.neighbors.forEach(([dx, dy], i) => {
			const nx = x + dx;
			const ny = y + dy;
			const neighborType = grid[ny]?.[nx];
			bitString += neighborType === currentType ? 1 : 0;
			if (neighborType === TileType.Water && currentType !== TileType.Water) {
				wave = true;
			}
		});

		// 输出验证
		// console.log('Correct Bitmask:', bitString);

		this.baseVisual.texture = this.calculateTexture(bitString);

		if (wave) {
			let ani = new SpriteSheetAnimator({
				frameWidth: 192,
				frameHeight: 192,
				globalSpeed: 0.3,
				animations: [{ name: 'wave', startFrame: 0, endFrame: 7, speed: 0.15, loop: true }],
			});
			let waveani = await ani.load('Foam');
			waveani.playAnimation('wave');
			waveani.x = this.x - 64;
			waveani.y = this.y - 64;
			console.log(this.parent.parent);
			(this.parent.parent as TerrainSystem).waveContainer.addChildAt(waveani, 0);
		}
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
	private grid: TileType[][];
	private tileSize: number;
	private bg: NineSliceSprite;
	public waveContainer = new Container();
	private tilesContainer = new Container();
	private tilesSort = [];

	constructor(private widthIdx: number, private heightIdx: number, tileSize: number = 64) {
		super();
		this.tileSize = tileSize;
		this.initTerrain();
	}

	private async initTerrain() {
		this.bg = this.addChild(new NineSliceSprite(await Assets.load('Tilemap_Water')));
		this.bg.width = this.widthIdx * this.tileSize;
		this.bg.height = this.heightIdx * this.tileSize;
		this.addChild(this.waveContainer);
		this.addChild(this.tilesContainer);
		// this.tilesContainer.scale.set(0.8);
		await this.initGrid();
		await this.initTiles();
	}

	private async initGrid() {
		const mapData = Array.from({ length: this.heightIdx }, () => Array.from({ length: this.widthIdx }, () => TileType.Dirt));

		// 生成水域（使用洪水扩散算法）
		this.createWaterClusters(mapData, 5); // 5个初始水点

		// 生成草地（水域周围）
		this.spreadTerrain(mapData, TileType.Water, TileType.Grass, 6);

		// 生成干草（草地上随机生成）
		this.spawnHay(mapData, 0.4); // 10%概率

		this.grid = mapData;
		for (let y = 0; y < this.heightIdx; y++) {
			for (let x = 0; x < this.widthIdx; x++) {
				let tile = await this.createTile(x, y, this.grid[y][x]);
				this.tilesSort.push(tile);
				if (this.grid[y][x] === TileType.Water) {
					// this.tilesContainer.addChildAt(tile, 0);
				} else {
					this.tilesContainer.addChild(tile);
				}
			}
		}
		return mapData;
	}

	createWaterClusters(mapData, initialPoints) {
		for (let i = 0; i < initialPoints; i++) {
			let x = Math.floor(Math.random() * this.widthIdx);
			let y = Math.floor(Math.random() * this.heightIdx);
			this.floodFill(mapData, x, y, TileType.Water, 0.7); // 70%扩散概率
		}
	}

	floodFill(mapData, x, y, targetType, spreadProb) {
		if (x < 0 || x >= this.widthIdx || y < 0 || y >= this.heightIdx) return;
		if (mapData[y][x] !== TileType.Dirt) return;

		mapData[y][x] = targetType;

		// 四方向扩散
		if (Math.random() < spreadProb) this.floodFill(mapData, x + 1, y, targetType, spreadProb * 0.9);
		if (Math.random() < spreadProb) this.floodFill(mapData, x - 1, y, targetType, spreadProb * 0.9);
		if (Math.random() < spreadProb) this.floodFill(mapData, x, y + 1, targetType, spreadProb * 0.9);
		if (Math.random() < spreadProb) this.floodFill(mapData, x, y - 1, targetType, spreadProb * 0.9);
	}

	// 地形扩散函数
	spreadTerrain(mapData, sourceType, targetType, radius) {
		for (let y = 0; y < this.heightIdx; y++) {
			for (let x = 0; x < this.widthIdx; x++) {
				if (mapData[y][x] === sourceType) {
					for (let dy = -radius; dy <= radius; dy++) {
						for (let dx = -radius; dx <= radius; dx++) {
							const nx = x + dx;
							const ny = y + dy;
							if (nx >= 0 && nx < this.widthIdx && ny >= 0 && ny < this.heightIdx) {
								if (mapData[ny][nx] === TileType.Dirt && Math.random() < 0.6) {
									mapData[ny][nx] = targetType;
								}
							}
						}
					}
				}
			}
		}
	}

	spawnHay(mapData, probability) {
		for (let y = 0; y < this.heightIdx; y++) {
			for (let x = 0; x < this.widthIdx; x++) {
				if (mapData[y][x] === TileType.Dirt && Math.random() < probability) {
					mapData[y][x] = TileType.Straw;
				}
			}
		}
	}

	private async initTiles() {
		for (let y = 0; y < this.heightIdx; y++) {
			for (let x = 0; x < this.widthIdx; x++) {
				(this.tilesSort[y * this.widthIdx + x] as TerrainTile).updateTexture(this.grid, x, y);
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
					(this.tilesSort[ny * this.widthIdx + nx] as TerrainTile).updateTexture(this.grid, nx, ny);
				}
			}
		}
	}

	private isValid(x: number, y: number): boolean {
		return x >= 0 && y >= 0 && x < this.widthIdx && y < this.heightIdx;
	}
}
