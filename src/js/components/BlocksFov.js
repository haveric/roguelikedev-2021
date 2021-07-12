import _Component from "./_Component";
import Extend from "../util/Extend";

export default class BlocksFov extends _Component {
    constructor(args = {}) {
        super(Extend.extend(args, {baseType: "blocksFov"}));
        const hasComponent = args.components && args.components.blocksFov;

        this.blocksFov = false;

        if (hasComponent) {
            // Whether the tile can be seen through
            this.blocksFov = args.components.blocksFov.blocksFov || false;
        }
    }

    save() {
        return {
            blocksFov: {
                blocksFov: this.blocksFov
            }
        }
    }
}