import ActionWithDirection from "./_ActionWithDirection";
import UnableToPerformAction from "./UnableToPerformAction";
import engine from "../Engine";

export default class MeleeAction extends ActionWithDirection {
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

        const blockingActor = engine.gameMap.getBlockingActorAtLocation(destX, destY, destZ);
        if (blockingActor) {
            console.log("You kick the " + blockingActor.name + ", much to its annoyance!");
        } else {
            return new UnableToPerformAction("There's nothing to attack there!");
        }
    }
}