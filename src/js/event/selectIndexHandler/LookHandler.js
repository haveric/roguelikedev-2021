import SelectIndexHandler from "./_SelectIndexHandler";
import controls from "../../controls/Controls";

export default class LookHandler extends SelectIndexHandler {
    constructor() {
        super();
    }

    handleInput() {
        if (controls.testPressed("look")) {
            this.exit();
        }

        super.handleInput();
    }

    confirmIndex() {
        this.exit();
    }
}