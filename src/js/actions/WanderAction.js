import MovementAction from "./actionWithDirection/MovementAction";
import {MathUtils} from "three";
import Action from "./_Action";
import WaitAction from "./WaitAction";

export default class WanderAction extends Action {
    constructor(entity) {
        super(entity);
    }

    perform() {
        // Wait
        if (Math.random() < .4) {
            return new WaitAction(this.entity).perform();
        } else {
            const x = MathUtils.randInt(-1, 1);
            const y = MathUtils.randInt(-1, 1);

            return new MovementAction(this.entity, x, y, 0).perform();
        }
    }
}