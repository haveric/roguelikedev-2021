import _Entity from "./_Entity";

export default class Item extends _Entity {
    constructor(args = {}) {
        super(args, "item");

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
        const saveJson = super.save();

        if (this.amount !== 1) {
            saveJson.amount = this.amount;
        }
        if (this.maxStackSize !== 1) {
            saveJson.maxStackSize = this.maxStackSize;
        }

        return saveJson;
    }

    clone() {
        return new Item(this.save());
    }

    setAmount(amount) {
        this.amount = amount;
        this.clearSaveCache();
    }
}