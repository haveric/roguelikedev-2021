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
                for (const item of inventory.items) {
                    this.items.push(entityLoader.create(item));
                }
            }
        }
    }

    save() {
        const itemJson = [];
        for (const item of this.items) {
            itemJson.push(JSON.stringify(item.save()));
        }

        return {
            inventory: {
                capacity: this.capacity,
                gold: this.gold,
                items: itemJson
            }
        }
    }

    remove(item) {
        const index = this.items.indexOf(item);
        this.items.splice(index, 1);
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