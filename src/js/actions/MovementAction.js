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

        const gameMap = engine.gameMap;
        if (!gameMap.isInBounds(destX, destY)) {
            return new UnableToPerformAction("Location is outside the map!");
        }

        const floorTile = gameMap.tiles.get(MapLayer.Floor)[destX][destY];
        if (!floorTile || !floorTile.getComponent("walkable") || !floorTile.getComponent("walkable").walkable) {
            return new UnableToPerformAction("Can't walk there!");
        }

        const wallTile = gameMap.tiles.get(MapLayer.Wall)[destX][destY];
        if (wallTile && wallTile.getComponent("blocksMovement").blocksMovement) {
            return new UnableToPerformAction("There's a wall in the way!");
        }

        const blockingActor = gameMap.getBlockingActorAtLocation(destX, destY);
        if (blockingActor) {
            return new UnableToPerformAction("There's something in the way!");
        }

        position.move(this.dx, this.dy, this.dz);

        return this;
    }
}