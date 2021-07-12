import _Component from "./_Component";
import Extend from "../util/Extend";

export default class Walkable extends _Component {
    constructor(args = {}) {
        super(Extend.extend(args, {baseType: "walkable"}));
        const hasComponent = args.components && args.components.walkable;

        this.walkable = false;

        if (hasComponent) {
            // Can walk on top of
            this.walkable = args.components.walkable.walkable || false;
        }
    }

    save() {
        return {
            walkable: {
                walkable: this.walkable
            }
        }
    }
}