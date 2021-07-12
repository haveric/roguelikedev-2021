import _Component from "./_Component";
import Extend from "../util/Extend";

export default class Fov extends _Component{
    constructor(args = {}) {
        super(Extend.extend(args, {baseType: "fov"}));
        const hasComponent = args.components && args.components.fov;

        if (hasComponent) {
            this.explored = args.components.fov.explored || false;
            this.visible = args.components.fov.visible || false;
        } else {
            this.explored = false;
            this.visible = false;
        }
    }

    save() {
        return {
            explored: this.explored
        }
    }
}