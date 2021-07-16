import _Component from "../_Component";
import Extend from "../../util/Extend";

export default class AI extends _Component {
    constructor(args = {}) {
        super(Extend.extend(args, {baseType: "ai"}));
    }

    save() {
        return null;
    }

    perform() {
        console.err("Not Implemented");
    }
}