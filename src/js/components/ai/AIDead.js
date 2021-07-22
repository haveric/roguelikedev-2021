import AI from "./_AI";
import Extend from "../../util/Extend";

export default class AIDead extends AI {
    constructor(args = {}) {
        super(Extend.extend(args, {type: "aiDead"}));
        const hasComponent = args.components && args.components.aiDead !== undefined;

        this.previousAI = "";

        if (hasComponent) {
            const aiDead = args.components.aiDead;
            if (aiDead && aiDead.previousAI) {
                this.previousAI = aiDead.previousAI;
            }
        }
    }

    save() {
        return {
            "aiDead": {
                "previousAI": this.previousAI
            }
        };
    }

    perform() {}
}