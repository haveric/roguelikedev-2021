import entityLoader from "../../entity/EntityLoader";

export default class MapGeneration {
    static floorEntity = entityLoader.createFromTemplate('floor', {components: {positionalobject: {x: 0, y: 0, z: 0}}});
    static wallEntity = entityLoader.createFromTemplate('wall', {components: {positionalobject: {x: 0, y: 0, z: 0}}});

    constructor() {}

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

            let startY = y1;
            let endY = y2;
            if (y1 > y2) {
                startY = y2;
                endY = y1;
            }
            for (let i = x1 - 1; i <= x1 + 1; i++) {
                for (let j = startY; j <= endY; j++) {
                    this.bresenhamCreateTiles(gameMap, i === x1, i, j);
                }
            }
        } else {
            let startX = x1;
            let endX = x2;
            if (x1 > x2) {
                startX = x2;
                endX = x1;
            }

            for (let j = y1 - 1; j <= y1 + 1; j++) {
                for (let i = startX; i <= endX; i++) {
                    this.bresenhamCreateTiles(gameMap, j === y1, i, j);
                }
            }
        }
    }


    static bresenhamCreateTiles(gameMap, createWall, i, j) {
        if (createWall) {
            const wallTile = gameMap.tiles.get(1)[i][j];
            if (wallTile) {
                const blocksMovement = wallTile.getComponent("blocksMovement");
                if (blocksMovement && blocksMovement.blocksMovement) {
                    gameMap.tiles.get(1)[i][j] = null;
                }
            }
        } else {
            const floorTile = gameMap.tiles.get(0)[i][j];
            if (!floorTile) {
                const wall = this.wallEntity.clone();
                wall.getComponent("positionalobject").moveTo(i, j, 1, false);
                gameMap.tiles.get(1)[i][j] = wall;
            }
        }

        const floor = this.floorEntity.clone();
        floor.getComponent("positionalobject").moveTo(i, j, 0, false);
        gameMap.tiles.get(0)[i][j] = floor;
    }
}