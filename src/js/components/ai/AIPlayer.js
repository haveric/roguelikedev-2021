import AI from "./_AI";
import Extend from "../../util/Extend";

export default class AIPlayer extends AI {
    constructor(args = {}) {
        super(Extend.extend(args, {type: "aiPlayer"}));
    }

    save() {
        return {
            "aiPlayer": {}
        }
    }

    perform() {}
}