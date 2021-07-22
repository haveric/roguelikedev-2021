import _Component from "../_Component";
import Extend from "../../util/Extend";

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
            parentInventory.remove(item);
        }
    }

    activate(action) {
        console.err("Not Implemented");
    }
}