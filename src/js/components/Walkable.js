import _Component from "./_Component";
import Extend from "../util/Extend";

export default class Walkable extends _Component {
    constructor(args = {}) {
        super(Extend.deep(args, {baseType: "walkable"}));
        const hasComponent = args.components && args.components.walkable;

        if (hasComponent) {
            // Can walk on top of
            this.walkable = args.components.walkable.walkable || false;
        } else {
            this.walkable = false;
        }
    }

    save() {
        return {
            walkable: this.walkable
        }
    }
}