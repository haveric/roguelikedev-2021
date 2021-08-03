import _Component from "../_Component";
import Extend from "../../util/Extend";

export default class Interactable extends _Component {
    constructor(args = {}) {
        super(Extend.extend(args, {baseType: "interactable"}));
    }

    save() {
        return null;
    }

    interact() {}
}