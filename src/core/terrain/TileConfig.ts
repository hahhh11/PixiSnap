/*
 * @Author: 98Precent
 * @Date: 2025-04-04 10:02:37
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-04-04 22:37:31
 * @FilePath: \PixiSnap\src\core\terrain\TileConfig.ts
 */
import { TileType } from './TileType';
export const TileConfig = {
	[TileType.Grass]: {
		name: 'Tilemap_Grass',
		splitX: 4,
		splitY: 4,
	},
    [TileType.Dirt]:{
        name: 'Tilemap_Dirt',
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
