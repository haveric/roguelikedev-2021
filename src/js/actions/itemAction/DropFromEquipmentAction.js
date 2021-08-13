import ItemAction from "./ItemAction";

export default class DropFromEquipmentAction extends ItemAction {
    constructor(entity, item, targetPosition) {
        super(entity, item, targetPosition);
    }

    perform() {
        const entityEquipment = this.entity.getComponent("equipment");
        entityEquipment.drop(this.item);
    }
}