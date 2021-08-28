import _Component from "../_Component";

export default class Interactable extends _Component {
    constructor(args = {}, type) {
        super(args, "interactable", type);
    }

    save() {
        return null;
    }

    interact() {}
}