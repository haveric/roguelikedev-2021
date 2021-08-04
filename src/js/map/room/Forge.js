import RectangularRoom from "./RectangularRoom";
import entityLoader from "../../entity/EntityLoader";
import {MathUtils} from "three";
import engine from "../../Engine";

export default class Forge extends RectangularRoom {
    constructor(x, y, width, height) {
        super(x, y, width, height);
    }

    createRoom(gameMap) {
        this.walls = [];
        const left = Math.max(0, this.x1);
        const right = Math.min(gameMap.width, this.x2 + 1);
        const top = Math.max(0, this.y1);
        const bottom = Math.min(gameMap.height, this.y2 + 1);

        for (let i = left; i < right; i++) {
            for (let j = top; j < bottom; j++) {
                const isRightHalf = i > this.x1 + (this.width / 2);
                const isBottomHalf = j < this.y1 + (this.height / 2);
                const previousFloorTile = gameMap.tiles.get(0)[i][j];
                if (!previousFloorTile) {
                    if (isRightHalf || isBottomHalf) {
                        gameMap.tiles.get(0)[i][j] = entityLoader.createFromTemplate('floor', {components: {positionalobject: {x: i, y: j, z: 0}}});
                    } else {
                        gameMap.tiles.get(0)[i][j] = entityLoader.createFromTemplate('floor_gravel', {components: {positionalobject: {x: i, y: j, z: 0}}});
                    }
                }

                const isVerticalEdge = (i === this.x1 || i === this.x2) && j >= this.y1 && j <= this.y2;
                const isHorizontalEdge = (j === this.y1 || j === this.y2) && i >= this.x1 && i <= this.x2;
                const wallTile = gameMap.tiles.get(1)[i][j];
                if (isHorizontalEdge || isVerticalEdge) {
                    if (!previousFloorTile && !wallTile) {
                        if (isRightHalf || isBottomHalf) {
                            gameMap.tiles.get(1)[i][j] = entityLoader.createFromTemplate('wall', {components: {positionalobject: {x: i, y: j, z: 1}}});
                            gameMap.tiles.get(2)[i][j] = entityLoader.createFromTemplate('wall', {components: {positionalobject: {x: i, y: j, z: 2}}});

                            let isCorner = isHorizontalEdge && isVerticalEdge;
                            if (!isCorner) {
                                this.walls.push(gameMap.tiles.get(1)[i][j]);
                            }
                        }
                    }
                } else {
                    if (wallTile) {
                        gameMap.tiles.get(1)[i][j] = null;
                    }
                }
            }
        }

        const x = MathUtils.randInt(this.x1 + 1, this.x2 - 1);
        const y = MathUtils.randInt(this.y1 + 1, this.y2 - 1);
        const npc = entityLoader.createFromTemplate('shop_owner', {components: {positionalobject: {x: x, y: y, z: 1}}});
        engine.gameMap.actors.push(npc);
    }
}