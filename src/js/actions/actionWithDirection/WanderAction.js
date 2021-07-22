import ActionWithDirection from "./_ActionWithDirection";
import MovementAction from "./MovementAction";
import {MathUtils} from "three";

export default class WanderAction extends ActionWithDirection {
    constructor(entity) {
        super(entity, 0, 0, 0);
    }

    perform() {
        // Wait
        if (Math.random() < .4) {
            return new MovementAction(this.entity, this.dx, this.dy, this.dz).perform();
        } else {
            const x = MathUtils.randInt(-1, 1);
            const y = MathUtils.randInt(-1, 1);

            return new MovementAction(this.entity, this.dx + x, this.dy + y, this.dz).perform();
        }
    }
}