import _Component from "./_Component";
import Extend from "../util/Extend";
import entityLoader from "../entity/EntityLoader";
import engine from "../Engine";
import messageConsole from "../ui/MessageConsole";
import inventory from "../ui/Inventory";

export default class Inventory extends _Component {
    constructor(args = {}) {
        super(Extend.extend(args, {baseType: "inventory"}));
        const hasComponent = args.components && args.components.inventory;

        this.gold = 0;

        if (hasComponent) {
            const inventory = args.components.inventory;

            this.gold = this.parseRandInt(inventory.gold, 0);
        }
    }

    save() {
        if (this.cachedSave) {
            return this.cachedSave;
        }

        const saveJson = {
            inventory: {
                gold: this.gold
            }
        };

        this.cachedSave = saveJson;
        return saveJson;
    }

    add(item) {
        this.clearSaveCache();

        if (item.id === "gold") {
            this.gold += item.amount;
            return true;
        }

        return false;
    }

    dropAll() {
        const gold = this.gold;
        if (gold > 0) {
            let goldItem = entityLoader.createFromTemplate('gold');
            goldItem.amount = gold;
            this.drop(goldItem);
        }

        this.clearSaveCache();
    }

    drop(item) {
        if (item) {
            const parentPosition = this.parentEntity.getComponent("positionalobject");
            engine.gameMap.addItem(item, parentPosition)

            if (this.isPlayer()) {
                messageConsole.text("You dropped the " + item.name).build();
            }

            this.clearSaveCache();
            if (this.isPlayer()) {
                inventory.populateInventory(engine.player);
            }
        }
    }

    onEntityDeath() {
        this.dropAll();
    }
}