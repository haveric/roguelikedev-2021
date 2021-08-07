import _Entity from "./_Entity";
import Extend from "../util/Extend";

export default class Item extends _Entity {
    constructor(args = {}) {
        super(Extend.deep(Item.getDefaultTemplate(), args));

        this.amount = 1;
        this.maxStackSize = 1;
        if (args.amount !== undefined) {
            this.amount = args.amount;
        }

        if (args.maxStackSize !== undefined) {
            this.maxStackSize = args.maxStackSize;
        }
    }

    save() {
        return Extend.deep(super.save(), {
            amount: this.amount,
            maxStackSize: this.maxStackSize
        });
    }

    clone() {
        return new Item(this.save());
    }

    static getDefaultTemplate() {
        return {
            type: "item",
            components: {
                "characterobject": {
                    scale: .1,
                    font: "helvetiker"
                }
            }
        }
    }

    setAmount(amount) {
        this.amount = amount;
        this.clearSaveCache();
    }
}