import ItemAction from "./ItemAction";

export default class DropAction extends ItemAction {
    constructor(entity, item, targetPosition) {
        super(entity, item, targetPosition);
    }

    perform() {
        const entityInventory = this.entity.getComponent("inventory");
        entityInventory.drop(this.item);
    }
}