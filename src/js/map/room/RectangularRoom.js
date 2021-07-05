import MapLayer from "../MapLayer";
import SolidTile from "../../entity/SolidTile";
import CharacterTile from "../../entity/CharacterTile";

export default class RectangularRoom {
    constructor(x, y, width, height) {
        this.x1 = x;
        this.y1 = y;
        this.x2 = x + width;
        this.y2 = y + height;
    }

    getCenterX() {
        return Math.round((this.x1 + this.x2) / 2);
    }

    getCenterY() {
        return Math.round((this.y1 + this.y2) / 2);
    }

    intersects(otherRoom) {
        return this.x1 <= otherRoom.x2
            && this.x2 >= otherRoom.x1
            && this.y1 <= otherRoom.y2
            && this.y2 >= otherRoom.y1;
    }

    createRoom(gameMap) {
        const left = Math.max(0, this.x1);
        const right = Math.min(gameMap.width, this.x2 + 1);
        const top = Math.max(0, this.y1);
        const bottom = Math.min(gameMap.height, this.y2 + 1);
        for (let i = left; i < right; i++) {
            for (let j = top; j < bottom; j++) {
                const previousFloorTile = gameMap.tiles.get(MapLayer.Floor)[i][j];
                if (!previousFloorTile) {
                    gameMap.tiles.get(MapLayer.Floor)[i][j] = new SolidTile({name: "Floor", x: i, y: j, z: 0, scale: 1, color: 0x333333});
                }

                const isVerticalEdge = (i === this.x1 || i === this.x2) && j >= this.y1 && j <= this.y2;
                const isHorizontalEdge = (j === this.y1 || j === this.y2) && i >= this.x1 && i <= this.x2;
                const wallTile = gameMap.tiles.get(MapLayer.Wall)[i][j];
                if (isHorizontalEdge || isVerticalEdge) {
                    if (!previousFloorTile && !wallTile) {
                        gameMap.tiles.get(MapLayer.Wall)[i][j] = new CharacterTile({name: "Wall", x: i, y: j, z: 1, scale: 1, letter: "#", color: 0x666666});
                    }
                } else {
                    if (wallTile) {
                        gameMap.tiles.get(MapLayer.Wall)[i][j] = null;
                    }
                }
            }
        }
    }
}