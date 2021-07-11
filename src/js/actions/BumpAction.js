import ActionWithDirection from "./_ActionWithDirection";
import UnableToPerformAction from "./UnableToPerformAction";
import engine from "../Engine";
import MeleeAction from "./MeleeAction";
import MovementAction from "./MovementAction";

export default class BumpAction extends ActionWithDirection {
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

        const blockingActor = engine.gameMap.getBlockingActorAtLocation(destX, destY);
        if (blockingActor) {
            return new MeleeAction(this.dx, this.dy, this.dz).perform(entity);
        } else {
            return new MovementAction(this.dx, this.dy, this.dz).perform(entity);
        }
    }
}