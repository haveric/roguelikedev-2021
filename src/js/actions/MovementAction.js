import UnableToPerformAction from "./UnableToPerformAction";
import MapLayer from "../map/MapLayer";
import engine from "../Engine";
import ActionWithDirection from "./_ActionWithDirection";

export default class MovementAction extends ActionWithDirection {
    constructor(dx, dy, dz) {
        super(dx, dy, dz);
    }

    perform(entity) {
        const position = entity.getComponent("positionalobject");
        if (!position) {
            return new UnableToPerformAction("Entity doesn't have a position.");
        }

        const destX = position.x + this.dx;
        const destY = position.y + this.dy;
        const destZ = position.z + this.dz;

        const gameMap = engine.gameMap;
        if (!gameMap.isInBounds(destX, destY)) {
            return new UnableToPerformAction("Location is outside the map!");
        }

        const wallTile = gameMap.tiles.get(destZ)[destX][destY];
        if (wallTile && wallTile.getComponent("blocksMovement").blocksMovement) {
            if (wallTile.getComponent("walkable") && wallTile.getComponent("walkable").walkable) {
                const wallTileUp = gameMap.tiles.get(destZ + 1)[destX][destY];
                if (!wallTileUp || !wallTileUp.getComponent("blocksMovement").blocksMovement) {
                    position.move(this.dx, this.dy, this.dz + 1);
                }
                return this;
            } else {
                return new UnableToPerformAction("There's a wall in the way!");
            }
        }

        const blockingActor = gameMap.getBlockingActorAtLocation(destX, destY);
        if (blockingActor) {
            return new UnableToPerformAction("There's something in the way!");
        }

        const floorTile = gameMap.tiles.get(destZ - 1)[destX][destY];
        if (!floorTile || !floorTile.getComponent("walkable") || !floorTile.getComponent("walkable").walkable) {
            if (!floorTile || (floorTile && floorTile.getComponent("blocksMovement") && floorTile.getComponent("blocksMovement").blocksMovement)) {
                return new UnableToPerformAction("Can't walk there!");
            } else if (floorTile) {
                position.move(this.dx, this.dy, this.dz - 1);
                return this;
            }
        }

        position.move(this.dx, this.dy, this.dz);

        return this;
    }
}