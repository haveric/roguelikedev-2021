import RectangularRoom from "./RectangularRoom";
import MapLayer from "../MapLayer";
import entityLoader from "../../entity/EntityLoader";
import {MathUtils} from "three";
import engine from "../../Engine";

export default class Shop extends RectangularRoom {
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
                const previousFloorTile = gameMap.tiles.get(MapLayer.Floor)[i][j];
                if (!previousFloorTile) {
                    gameMap.tiles.get(MapLayer.Floor)[i][j] = entityLoader.createFromTemplate('floor', {components: {positionalobject: {x: i, y: j, z: 0}}});
                }

                const isVerticalEdge = (i === this.x1 || i === this.x2) && j >= this.y1 && j <= this.y2;
                const isHorizontalEdge = (j === this.y1 || j === this.y2) && i >= this.x1 && i <= this.x2;
                const wallTile = gameMap.tiles.get(MapLayer.Wall)[i][j];
                if (isHorizontalEdge || isVerticalEdge) {
                    if (!previousFloorTile && !wallTile) {
                        gameMap.tiles.get(MapLayer.Wall)[i][j] = entityLoader.createFromTemplate('wall', {components: {positionalobject: {x: i, y: j, z: 1}}});
                        gameMap.tiles.get(MapLayer.DecorativeBG)[i][j] = entityLoader.createFromTemplate('wall', {components: {positionalobject: {x: i, y: j, z: 2}}});

                        let isCorner = isHorizontalEdge && isVerticalEdge;
                        if (!isCorner) {
                            this.walls.push(gameMap.tiles.get(MapLayer.Wall)[i][j]);
                        }
                    }
                } else {
                    if (wallTile) {
                        gameMap.tiles.get(MapLayer.Wall)[i][j] = null;
                    }
                }
            }
        }

        let randWall = MathUtils.randInt(0, this.walls.length - 1);
        const wall = this.walls[randWall];
        const position = wall.getComponent("positionalobject");

        gameMap.tiles.get(MapLayer.Wall)[position.x][position.y] = entityLoader.createFromTemplate('door', {components: {positionalobject: {x: position.x, y: position.y, z: 1}}});

        const x = MathUtils.randInt(this.x1 + 1, this.x2 - 1);
        const y = MathUtils.randInt(this.y1 + 1, this.y2 - 1);
        const npc = entityLoader.createFromTemplate('shop_owner', {components: {positionalobject: {x: x, y: y, z: 1}}});
        engine.gameMap.actors.push(npc);
    }
}