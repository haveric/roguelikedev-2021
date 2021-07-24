import Action from "../_Action";
import engine from "../../Engine";
import {Vector3} from "three";

export default class ItemAction extends Action {
    /**
     *
     * @param entity
     * @param item
     * @param {Vector3} targetPosition
     */
    constructor(entity, item, targetPosition) {
        super(entity);

        this.item = item;
        this.targetPosition = targetPosition;
    }

    perform() {
        const consumable = this.item.getComponent("consumable");
        if (consumable) {
            return consumable.activate(this);
        }
    }

    getTargetActor() {
        const actorPosition = new Vector3(this.targetPosition.x, this.targetPosition.y, this.targetPosition.z + 1);
        return engine.gameMap.getAliveActorAtLocation(actorPosition);
    }
}