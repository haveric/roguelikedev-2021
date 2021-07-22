import Action from "./_Action";
import engine from "../Engine";

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
        return engine.gameMap.getAliveActorAtLocation(this.targetPosition);
    }
}