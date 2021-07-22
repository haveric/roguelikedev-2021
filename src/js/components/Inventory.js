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
        for (let i = 0; i < this.capacity; i++) {
            if (!this.items[i]) {
                this.items[i] = item;
                return true;
            }
        }

        return false;
    }

    remove(item) {
        const index = this.items.indexOf(item);
        this.items.splice(index, 1, null);
    }

    drop(item) {
        const parent = this.parentEntity;
        const parentPosition = parent.getComponent("positionalobject");
        const position = item.getComponent("positionalobject");
        position.x = parentPosition.x;
        position.y = parentPosition.y;
        position.z = parentPosition.z;
        item.parent = null;
        engine.gameMap.items.push(item);
        position.setVisible();

        if (parent === engine.player) {
            messageConsole.text("You dropped the " + item.name).build();
        }

        this.remove(item);
    }
}