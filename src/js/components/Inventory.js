import _Component from "./_Component";
import Extend from "../util/Extend";
import entityLoader from "../entity/EntityLoader";
import engine from "../Engine";

export default class Inventory extends _Component {
    constructor(args = {}) {
        super(Extend.extend(args, {baseType: "inventory"}));
        const hasComponent = args.components && args.components.inventory;

        this.capacity = 10;
        this.items = [];

        if (hasComponent) {
            const inventory = args.components.inventory;
            if (inventory.capacity !== undefined) {
                this.capacity = args.components.inventory.capacity;
            }

            if (inventory.items !== undefined) {
                for (const item of inventory.items) {
                    this.items.push(entityLoader.create(item));
                }
            }
        }
    }

    save() {
        const itemSave = [];
        for (const item of this.items) {
            itemSave.push(item.save());
        }

        return {
            inventory: {
                capacity: this.capacity,
                items: itemSave.toString()
            }
        }
    }

    drop(item) {
        const parent = this.parentEntity;
        const parentPosition = parent.getComponent("positionalobject");
        const position = item.getComponent("positionalobject");
        position.x = parentPosition.x;
        position.y = parentPosition.y;
        position.z = parentPosition.z;
        item.setVisible();
        engine.gameMap.items.push(item);

        const index = this.items.indexOf(item);
        this.items.slice(index, 1);
    }
}