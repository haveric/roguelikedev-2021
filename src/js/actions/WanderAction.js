import MovementAction from "./actionWithDirection/MovementAction";
import {MathUtils} from "three";
import Action from "./_Action";
import WaitAction from "./WaitAction";

export default class WanderAction extends Action {
    constructor(entity) {
        super(entity);
    }

    perform() {
        const x = MathUtils.randInt(-1, 1);
        const y = MathUtils.randInt(-1, 1);

        if (x === 0 && y === 0) {
            return new WaitAction(this.entity).perform();
        } else {
            return new MovementAction(this.entity, x, y, 0).perform();
        }
    }
}