import _Component from "./_Component";
import Extend from "../util/Extend";
import entityLoader from "../entity/EntityLoader";
import engine from "../Engine";
import messageConsole from "../ui/MessageConsole";

export default class Inventory extends _Component {
    constructor(args = {}) {
        super(Extend.extend(args, {baseType: "inventory"}));
        const hasComponent = args.components && args.components.inventory;

        this.capacity = 10;
        this.items = [];
        this.gold = 0;

        if (hasComponent) {
            const inventory = args.components.inventory;
            if (inventory.capacity !== undefined) {
                this.capacity = inventory.capacity;
            }

            if (inventory.gold !== undefined) {
                this.gold = inventory.gold;
            }

            if (inventory.items !== undefined) {
                for (let i = 0; i < inventory.items.length; i++) {
                    const item = inventory.items[i];
                    if (item !== null) {
                        this.items[i] = entityLoader.create(item);
                    }
                }
            }
        }
    }

    save() {
        const itemJson = [];
        for (const item of this.items) {
            if (item === null) {
                itemJson.push(null);
            } else {
                itemJson.push(JSON.stringify(item.save()));
            }
        }

        return {
            inventory: {
                capacity: this.capacity,
                gold: this.gold,
                items: itemJson
            }
        }
    }

    add(item) {
        if (item.name === "Gold") {
            this.gold += item.amount;
            return true;
        }

        const originalAmount = item.amount;
        let amountToAdd = item.amount;
        // Add partial stack
        for (let i = 0; i < this.capacity; i++) {
            const inventoryItem = this.items[i];
            if (inventoryItem) {
                // TODO: Use a better method of determining equality
                if (item.name === inventoryItem.name) {
                    let amountCanAdd = inventoryItem.maxStackSize - inventoryItem.amount;
                    if (amountCanAdd >= amountToAdd) {
                        inventoryItem.amount += amountToAdd;
                        return true;
                    } else {
                        inventoryItem.amount += amountCanAdd;
                        item.amount -= amountCanAdd;
                        amountToAdd -= amountCanAdd;
                    }
                }
            }
        }

        // Add full stack
        for (let i = 0; i < this.capacity; i++) {
            if (!this.items[i]) {
                this.items[i] = item;
                return true;
            }
        }

        return originalAmount !== amountToAdd;
    }

    use(item, amount) {
        item.amount -= amount;

        if (item.amount <= 0) {
            this.remove(item);
        }
    }

    remove(item) {
        const index = this.items.indexOf(item);
        this.items.splice(index, 1, null);
    }

    drop(item) {
        const parentPosition = this.parentEntity.getComponent("positionalobject");
        const position = item.getComponent("positionalobject");
        position.x = parentPosition.x;
        position.y = parentPosition.y;
        position.z = parentPosition.z;
        item.parent = null;
        engine.gameMap.items.push(item);
        position.setVisible();

        if (this.isPlayer()) {
            messageConsole.text("You dropped the " + item.name).build();
        }

        this.remove(item);
    }
}