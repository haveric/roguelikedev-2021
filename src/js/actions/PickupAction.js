import Action from "./_Action";
import engine from "../Engine";
import messageConsole from "../ui/MessageConsole";
import UnableToPerformAction from "./UnableToPerformAction";
import inventory from "../ui/Inventory";
import NoAction from "./NoAction";

export default class PickupAction extends Action {
    constructor(entity) {
        super(entity);
    }

    perform() {
        const position = this.entity.getComponent("positionalobject");
        const entityInventory = this.entity.getComponent("inventory");

        const itemsToPickup = [];
        let anyGoldPickedUp = false;
        for (const item of engine.gameMap.items) {
            const itemPosition = item.getComponent("positionalobject");
            if (position.x === itemPosition.x && position.y === itemPosition.y && position.z === itemPosition.z) {
                if (entityInventory.add(item)) {
                    anyGoldPickedUp = true;
                    item.parentEntity = entityInventory;
                    engine.gameMap.removeItem(item);
                    itemPosition.teardown();

                    engine.fov.remove(item);
                    engine.needsMapUpdate = true;

                    if (this.isPlayer()) {
                        inventory.populateInventory(engine.player);

                        if (item.amount > 1) {
                            messageConsole.text("You picked up " + item.amount + " " + item.name);
                        } else {
                            messageConsole.text("You picked up the " + item.name);
                        }
                        messageConsole.build();
                    }
                } else {
                    itemsToPickup.push(item);
                }
            }
        }

        const entityEquipment = this.entity.getComponent("equipment");
        for (const item of itemsToPickup) {
            if (entityEquipment.addItem(item)) {
                const itemPosition = item.getComponent("positionalobject");
                engine.gameMap.removeItem(item);
                itemPosition.teardown();

                engine.fov.remove(item);
                engine.needsMapUpdate = true;

                if (this.isPlayer()) {
                    inventory.populateInventory(engine.player);

                    if (item.amount > 1) {
                        messageConsole.text("You picked up " + item.amount + " " + item.name);
                    } else {
                        messageConsole.text("You picked up the " + item.name);
                    }
                    messageConsole.build();
                }

                return this;
            } else {
                if (!anyGoldPickedUp) {
                    return new UnableToPerformAction(this.entity, "Nothing to pick up here.");
                }
            }
        }

        return new NoAction(this.entity);
    }
}