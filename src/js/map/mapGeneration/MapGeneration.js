import MapLayer from "../MapLayer";
import SolidTile from "../../entity/SolidTile";
import CharacterTile from "../../entity/CharacterTile";

export default class MapGeneration {
    constructor() {

    }

    static tunnelBetween(gameMap, x1, y1, x2, y2) {
        let cornerX,
            cornerY;
        if (Math.random() < 0.5) {
            cornerX = x2;
            cornerY = y1;
        } else {
            cornerX = x1;
            cornerY = y2;
        }

        this.bresenham(gameMap, x1, y1, cornerX, cornerY);
        this.bresenham(gameMap, cornerX, cornerY, x2, y2);
    }

    static bresenham(gameMap, x1, y1, x2, y2) {
        if (x1 === x2) {
            if (y1 === y2) {
                return;
            }

            for (let i = x1 - 1; i <= x1 + 1; i++) {
                for (let j = y1; j <= y2; j++) {
                    this.bresenhamCreateTiles(gameMap, i === x1, i, j);
                }
            }
        } else {
            for (let j = y1 - 1; j <= y1 + 1; j++) {
                for (let i = x1; i <= x2; i++) {
                    this.bresenhamCreateTiles(gameMap, j === y1, i, j);
                }
            }
        }
    }

    static bresenhamCreateTiles(gameMap, createWall, i, j) {
        if (createWall) {
            const wallTile = gameMap.tiles.get(MapLayer.Wall)[i][j];
            if (wallTile) {
                gameMap.tiles.get(MapLayer.Wall)[i][j] = null;
            }
        } else {
            const floorTile = gameMap.tiles.get(MapLayer.Floor)[i][j];
            if (!floorTile) {
                gameMap.tiles.get(MapLayer.Wall)[i][j] = new CharacterTile({name: "Wall", x: i, y: j, z: 1, scale: 1, letter: "#", color: 0x666666});
            }
        }

        gameMap.tiles.get(MapLayer.Floor)[i][j] = new SolidTile({name: "Floor", x: i, y: j, z: 0, scale: 1, color: 0x333333});
    }
}