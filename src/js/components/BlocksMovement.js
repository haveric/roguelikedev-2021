import _Component from "./_Component";
import Extend from "../util/Extend";

export default class BlocksMovement extends _Component {
    constructor(args = {}) {
        super(Extend.extend(args, {baseType: "blocksMovement"}));
        const hasComponent = args.components && args.components.blocksMovement !== undefined;

        // Whether the tile can moved into
        this.blocksMovement = false;

        if (hasComponent) {
            const type = typeof args.components.blocksMovement;
            if (type === "boolean") {
                this.blocksMovement = args.components.blocksMovement;
            } else if (type === "object") {
                if (args.components.blocksMovement) {
                    this.blocksMovement = args.components.blocksMovement.blocksMovement;
                }
            }
        }
    }

    save() {
        return {
            blocksMovement: this.blocksMovement
        }
    }

    onEntityDeath() {
        this.blocksMovement = false;
    }
}