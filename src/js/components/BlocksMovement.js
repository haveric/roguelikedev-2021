import _Component from "./_Component";
import Extend from "../util/Extend";

export default class BlocksMovement extends _Component {
    constructor(args = {}) {
        super(Extend.extend(args, {baseType: "blocksMovement"}));
        const hasComponent = args.components && args.components.blocksMovement;

        if (hasComponent) {
            // Whether the tile can moved into
            this.blocksMovement = args.components.blocksMovement.blocksMovement || false;
        } else {
            this.blocksMovement = false;
        }
    }

    save() {
        return {
            blocksMovement: this.blocksMovement
        }
    }
}