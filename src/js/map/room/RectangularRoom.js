import MapLayer from "../MapLayer";
import {MathUtils} from "three";
import engine from "../../Engine";
import entityLoader from "../../entity/EntityLoader";
import chanceLoader from "../mapGeneration/ChanceLoader";

export default class RectangularRoom {
    constructor(x, y, width, height) {
        this.x1 = x;
        this.y1 = y;
        this.x2 = x + width;
        this.y2 = y + height;
        this.width = width;
        this.height = height;
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
                    gameMap.tiles.get(MapLayer.Floor)[i][j] = entityLoader.createFromTemplate("floor", {components: {positionalobject: {x: i, y: j, z: 0}}});
                }

                const isVerticalEdge = (i === this.x1 || i === this.x2) && j >= this.y1 && j <= this.y2;
                const isHorizontalEdge = (j === this.y1 || j === this.y2) && i >= this.x1 && i <= this.x2;
                const wallTile = gameMap.tiles.get(MapLayer.Wall)[i][j];
                if (isHorizontalEdge || isVerticalEdge) {
                    if (!previousFloorTile && !wallTile) {
                        gameMap.tiles.get(MapLayer.Wall)[i][j] = entityLoader.createFromTemplate("wall", {components: {positionalobject: {x: i, y: j, z: 1}}});
                    }
                } else {
                    if (wallTile) {
                        gameMap.tiles.get(MapLayer.Wall)[i][j] = null;
                    }
                }
            }
        }
    }

    placeEntities(name, level, maxMonsters) {
        const numMonsters = MathUtils.randInt(0, maxMonsters);
        for (let i = 0; i < numMonsters; i++) {
            const x = MathUtils.randInt(this.x1 + 1, this.x2 -1);
            const y = MathUtils.randInt(this.y1 + 1, this.y2 -1);

            const blockingActor = engine.gameMap.getBlockingActorAtLocation(x, y, 1);
            if (!blockingActor) {
                const position = {components: {positionalobject: {x: x, y: y, z: 1}}};

                const actorId = chanceLoader.getActorForLevel(name, level);
                const actor = entityLoader.createFromTemplate(actorId, position);

                engine.gameMap.actors.push(actor);
            }
        }
    }

    placeItems(name, level, maxItems) {
        const numItems = MathUtils.randInt(0, maxItems);
        for (let i = 0; i < numItems; i++) {
            const x = MathUtils.randInt(this.x1 + 1, this.x2 -1);
            const y = MathUtils.randInt(this.y1 + 1, this.y2 -1);

            const position = {components: {positionalobject: {x: x, y: y, z: 1}}};
            const itemId = chanceLoader.getItemForLevel(name, level);
            const item = entityLoader.createFromTemplate(itemId, position);

            engine.gameMap.items.push(item);
        }

        const numGoldItems = MathUtils.randInt(0, maxItems);
        for (let i = 0; i < numGoldItems; i++) {
            const x = MathUtils.randInt(this.x1 + 1, this.x2 -1);
            const y = MathUtils.randInt(this.y1 + 1, this.y2 -1);
            const amount = MathUtils.randInt(1, 25);
            const position = {amount: amount, components: {positionalobject: {x: x, y: y, z: 1}}};
            const item = entityLoader.createFromTemplate("gold", position);

            engine.gameMap.items.push(item);
        }
    }
}