import Action from "./_Action";
import engine from "../Engine";
import messageConsole from "../ui/MessageConsole";
import UnableToPerformAction from "./UnableToPerformAction";
import inventory from "../ui/Inventory";

export default class PickupAction extends Action {
    constructor(entity) {
        super(entity);
    }

    perform() {
        const position = this.entity.getComponent("positionalobject");
        const entityInventory = this.entity.getComponent("inventory");
        for (const item of engine.gameMap.items) {
            const itemPosition = item.getComponent("positionalobject");
            if (position.x === itemPosition.x && position.y === itemPosition.y && position.z === itemPosition.z) {
                item.parent = entityInventory;
                if (entityInventory.add(item)) {
                    const itemIndex = engine.gameMap.items.indexOf(item);
                    engine.gameMap.items.splice(itemIndex, 1);
                    itemPosition.teardown();


                    if (this.isPlayer()) {
                        inventory.populateInventory(engine.player);
                        messageConsole.text("You picked up the " + item.name).build();
                    }
                    return this;
                } else {
                    return new UnableToPerformAction(this.entity, "Your inventory is full!");
                }
            }
        }

        return new UnableToPerformAction(this.entity, "There is nothing here to pick up.");
    }
}