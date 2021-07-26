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

            this.gold = this.parseRandInt(inventory.gold, 0);
            if (inventory.items !== undefined) {
                for (let i = 0; i < inventory.items.length; i++) {
                    const item = inventory.items[i];
                    if (item !== null) {
                        this.items[i] = entityLoader.create(item);
                        this.items[i].parent = this;
                    }
                }
            }
        }
    }

    save() {
        const itemJson = [];
        for (const item of this.items) {
            if (!item) {
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
        if (item.id === "gold") {
            this.gold += item.amount;
            return true;
        }

        const originalAmount = item.amount;
        let amountToAdd = item.amount;

        let partialMax;
        if (this.capacity === -1) {
            partialMax = this.items.length;
        } else {
            partialMax = this.capacity;
        }
        // Add partial stack
        for (let i = 0; i < partialMax; i++) {
            const inventoryItem = this.items[i];
            if (inventoryItem) {
                if (item.id === inventoryItem.id) {
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
        if (this.capacity === -1) {
            this.items[this.items.length] = item;
        } else {
            for (let i = 0; i < this.capacity; i++) {
                if (!this.items[i]) {
                    this.items[i] = item;
                    return true;
                }
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
        if (index > -1) {
            this.items.splice(index, 1, null);
        }

        engine.needsMapUpdate = true;
    }

    move(fromIndex, toIndex) {
        if (fromIndex !== toIndex) {
            const fromItem = this.items[fromIndex];

            this.items[fromIndex] = this.items[toIndex];
            this.items[toIndex] = fromItem;
        }
    }

    dropAll() {
        for (const item of this.items) {
            if (item) {
                this.drop(item);
            }
        }

        const gold = this.gold;
        if (gold > 0) {
            let goldItem = entityLoader.createFromTemplate('gold');
            goldItem.amount = gold;
            this.drop(goldItem);
        }
    }

    drop(item) {
        if (item) {
            this.mergeItemOnGround(item);

            if (this.isPlayer()) {
                messageConsole.text("You dropped the " + item.name).build();
            }

            this.remove(item);
        }
    }

    mergeItemOnGround(item) {
        const parentPosition = this.parentEntity.getComponent("positionalobject");

        let amountToAdd = item.amount;
        for (const mapItem of engine.gameMap.items) {
            if (mapItem.id === item.id) {
                const position = mapItem.getComponent("positionalobject");
                const remnant = mapItem.getComponent("remnant");
                if (position && parentPosition.isSamePosition(position) && (!remnant || !remnant.isRemnant)) {
                    if (item.id === "gold") {
                        mapItem.gold += item.amount;
                        return true;
                    }

                    let amountCanAdd = mapItem.maxStackSize - mapItem.amount;
                    if (amountCanAdd >= amountToAdd) {
                        mapItem.amount += amountToAdd;
                        return true;
                    } else {
                        mapItem.amount += amountCanAdd;
                        item.amount -= amountCanAdd;
                        amountToAdd -= amountCanAdd;
                    }
                }
            }
        }

        if (amountToAdd > 0) {
            item.amount = amountToAdd;

            const position = item.getComponent("positionalobject");
            position.x = parentPosition.x;
            position.y = parentPosition.y;
            position.z = parentPosition.z;
            item.parent = null;
            engine.gameMap.items.push(item);
            position.setVisible();
        }
    }

    onEntityDeath() {
        this.dropAll();
    }
}