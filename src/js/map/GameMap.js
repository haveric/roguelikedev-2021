import ArrayUtil from "../util/ArrayUtil";
import MapLayer from "./MapLayer";
import CharacterTile from "../entity/CharacterTile";
import SolidTile from "../entity/SolidTile";

export default class GameMap {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.tiles = new Map();

        this.tiles.set(MapLayer.Floor, ArrayUtil.create2dArray(width));
        this.tiles.set(MapLayer.Wall, ArrayUtil.create2dArray(width));
        this.tiles.set(MapLayer.Decorative, ArrayUtil.create2dArray(width));
    }

    createTestMap() {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                let tile;
                if (j === 5 || i === 5) {
                    this.tiles.get(MapLayer.Wall)[i][j] = new CharacterTile("Wall", i, j, 1, 1, "#", 0x666666);
                }

                if (i === 12 && j === 12) {
                    this.tiles.get(MapLayer.Wall)[i][j] = new CharacterTile("Door", i, j, 1, 1, "+", 0x964b00);
                }

                if (j === 3 || i === 3) {
                    tile = new CharacterTile("Water", i, j, 0, .7, "≈", 0x3333cc);
                } else {
                    tile = new SolidTile("Floor", i, j, 0, 1, 0x333333);
                }

                this.tiles.get(MapLayer.Floor)[i][j] = tile;
            }
        }
    }
}