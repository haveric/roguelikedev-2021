import _Component from "../_Component";
import Extend from "../../util/Extend";
import engine from "../../Engine";
import ItemAction from "../../actions/itemAction/ItemAction";

export default class Consumable extends _Component {
    constructor(args = {}) {
        super(Extend.extend(args, {baseType: "consumable"}));
    }

    save() {
        return null;
    }

    consume() {
        const item = this.getItem();
        const parentInventory = item.parent;
        if (parentInventory) {
            parentInventory.use(item, 1);
        }
    }

    /**
     *
     * @returns {Action}
     */
    getAction() {
        const consumer = this.getConsumer();
        const item = this.getItem();

        return new ItemAction(consumer, item);
    }

    activate(action) {
        console.error("Not Implemented");
    }

    getItem() {
        return this.parentEntity;
    }

    getInventory() {
        return this.parentEntity.parent;
    }

    getConsumer() {
        return this.parentEntity.parent.parentEntity;
    }

    isPlayer() {
        return this.getConsumer() === engine.player;
    }
}