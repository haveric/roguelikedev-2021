import SelectIndexHandler from "./_SelectIndexHandler";
import engine from "../../Engine";

export default class SingleRangedAttackHandler extends SelectIndexHandler {
    constructor(callback) {
        super();

        this.callback = callback;
    }

    confirmIndex() {
        engine.processAction(this.callback(this.position));
        this.exit();
    }
}