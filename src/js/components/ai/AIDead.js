import AI from "./_AI";
import Extend from "../../util/Extend";

export default class AIDead extends AI {
    constructor(args = {}) {
        super(Extend.extend(args, {type: "aiDead"}));

        this.previousAI = "";

        const aiDead = args.components.aiDead;
        if (aiDead && aiDead.previousAI) {
            this.previousAI = aiDead.previousAI;
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