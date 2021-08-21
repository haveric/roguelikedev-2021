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
        const parentStorage = item.parentEntity;
        if (parentStorage) {
            parentStorage.use(item, 1);
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

    activate(/*action*/) {
        console.error("Not Implemented");
    }

    getItem() {
        return this.parentEntity;
    }

    getConsumer() {
        let parent = this.parentEntity;
        while (parent && parent.type !== "actor") {
            parent = parent.parentEntity;
        }
        return parent;
    }

    isPlayer() {
        return this.getConsumer() === engine.player;
    }
}