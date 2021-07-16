import UnableToPerformAction from "./UnableToPerformAction";
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

        const ground = this.tryMoveTo(gameMap, destX, destY, destZ);
        if (!(ground instanceof UnableToPerformAction)) {
            position.move(this.dx, this.dy, this.dz);
            return ground;
        }

        const below = this.tryMoveTo(gameMap, destX, destY, destZ - 1);
        if (!(below instanceof UnableToPerformAction)) {
            position.move(this.dx, this.dy, this.dz - 1);
            return below;
        }

        const above = this.tryMoveTo(gameMap, destX, destY, destZ + 1);
        if (!(above instanceof UnableToPerformAction)) {
            position.move(this.dx, this.dy, this.dz + 1);
            return above;
        }

        return ground;
    }

    tryMoveTo(gameMap, destX, destY, destZ) {
        const blockingActor = gameMap.getBlockingActorAtLocation(destX, destY, destZ);
        if (blockingActor) {
            return new UnableToPerformAction("There's something in the way!");
        }

        if (gameMap.tiles.has(destZ)) {
            const wallTile = gameMap.tiles.get(destZ)[destX][destY];
            if (wallTile) {
                const blocksMovementComponent = wallTile.getComponent("blocksMovement");
                if (blocksMovementComponent && blocksMovementComponent.blocksMovement) {
                    return new UnableToPerformAction("There's a wall in the way!");
                }
            }
        }

        if (!gameMap.tiles.has(destZ - 1)) {
            return new UnableToPerformAction("No level to walk on!");
        }

        const floorTile = gameMap.tiles.get(destZ - 1)[destX][destY];
        if (!floorTile) {
            return new UnableToPerformAction("No floor to walk on.");
        }

        const walkableComponent = floorTile.getComponent("walkable");
        if (walkableComponent && walkableComponent.walkable) {
            return this;
        } else {
            return new UnableToPerformAction("There's nothing to walk on.");
        }
    }
}