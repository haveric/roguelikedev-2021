import _Component from "./_Component";
import Extend from "../util/Extend";

export default class VisibilityModifier extends _Component {
    constructor(args = {}) {
        super(Extend.extend(args, {baseType: "visibilityModifier"}));
        const hasComponent = args.components && args.components.visibilityModifier !== undefined;

        this.modifier = "+";
        this.amount = 0;

        if (hasComponent) {
            const arg = args.components.visibilityModifier;
            if (arg.modifier) {
                this.modifier = arg.modifier;
            }

            this.amount = arg.amount;
        }
    }

    save() {
        return {
            "visibilityModifier": {
                "modifier": this.modifier,
                "amount": this.amount
            }
        }
    }

    getVisibility(visibility) {
        switch (this.modifier) {
            case "+":
            default:
                return visibility + this.amount;
            case "-": return visibility - this.amount;
            case "*": return visibility * this.amount;
            case "/": return visibility / this.amount;
        }
    }
}