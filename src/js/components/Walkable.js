import _Component from "./_Component";
import Extend from "../util/Extend";

export default class Walkable extends _Component {
    constructor(args = {}) {
        super(Extend.extend(args, {baseType: "walkable"}));
        const hasComponent = args.components && args.components.walkable !== undefined;

        // Can walk on top of
        this.walkable = false;

        if (hasComponent) {
            const type = typeof args.components.walkable;
            if (type === "boolean") {
                this.walkable = args.components.walkable;
            } else if (type === "object") {
                if (args.components.walkable) {
                    this.walkable = args.components.walkable.walkable;
                }
            }
        }
    }

    save() {
        if (this.cachedSave) {
            return this.cachedSave;
        }

        const saveJson = {
            walkable: this.walkable
        };

        this.cachedSave = saveJson;
        return saveJson;
    }
}