import ActionWithDirection from "./_ActionWithDirection";
import UnableToPerformAction from "../UnableToPerformAction";
import engine from "../../Engine";
import MeleeAction from "./MeleeAction";
import MovementAction from "./MovementAction";
import MapLayer from "../../map/MapLayer";
import OpenAction from "./OpenAction";

export default class BumpAction extends ActionWithDirection {
    constructor(entity, dx, dy, dz) {
        super(entity, dx, dy, dz);
    }

    perform() {
        const position = this.entity.getComponent("positionalobject");
        if (!position) {
            return new UnableToPerformAction(this.entity, "Entity doesn't have a position.");
        }

        const destX = position.x + this.dx;
        const destY = position.y + this.dy;
        const destZ = position.z + this.dz;

        const blockingActor = engine.gameMap.getBlockingActorAtLocation(destX, destY, destZ);
        if (blockingActor) {
            return new MeleeAction(this.entity, this.dx, this.dy, this.dz).perform();
        } else {
            const tileX = engine.gameMap.tiles.get(MapLayer.Wall)[destX];
            if (tileX) {
                const wallTile = tileX[destY];
                if (wallTile) {
                    const openable = wallTile.getComponent("openable");
                    if (openable && !openable.isOpen) {
                        return new OpenAction(this.entity, this.dx, this.dy, this.dz).perform();
                    }
                }
                return new MovementAction(this.entity, this.dx, this.dy, this.dz).perform();
            } else {
                return new UnableToPerformAction(this.entity, "Nowhere to move.");
            }
        }
    }
}