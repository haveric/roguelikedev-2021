import _Component from "../_Component";
import Extend from "../../util/Extend";
import engine from "../../Engine";

export default class Consumable extends _Component {
    constructor(args = {}) {
        super(Extend.extend(args, {baseType: "consumable"}));
    }

    save() {
        return null;
    }

    consume() {
        const item = this.parentEntity;
        const parentInventory = item.parent;
        if (parentInventory) {
            parentInventory.use(item, 1);
        }
    }

    activate(action) {
        console.err("Not Implemented");
    }

    isPlayer() {
        return this.parentEntity.parent.parentEntity === engine.player;
    }
}