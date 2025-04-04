/*
 * @Author: 98Precent
 * @Date: 2025-04-04 10:02:37
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-04-04 10:15:18
 * @FilePath: \PixiSnap\src\core\terrain\TileConfig.ts
 */
import { TileType } from './TileType';
export const TileConfig = {
	[TileType.Grass]: {
		name: 'Tilemap_Grass',
		splitX: 4,
		splitY: 4,
	},
	[TileType.Straw]: {
		name: 'Tilemap_Straw',
		splitX: 4,
		splitY: 4,
	},
	[TileType.Water]: {
		name: 'Tilemap_Water',
		splitX: 1,
		splitY: 1,
	},
};
