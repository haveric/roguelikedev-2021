import _Component from "./_Component";

export default class VisibilityModifier extends _Component {
    constructor(args = {}) {
        super(args, "visibilityModifier");
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
        if (this.cachedSave) {
            return this.cachedSave;
        }

        const saveJson = {
            "visibilityModifier": {
                "modifier": this.modifier,
                "amount": this.amount
            }
        };

        this.cachedSave = saveJson;
        return saveJson;
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