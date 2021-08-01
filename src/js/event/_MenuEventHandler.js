import EventHandler from "./_EventHandler";
import engine from "../Engine";

export default class MenuEventHandler extends EventHandler {
    constructor(eventHandler) {
        super();

        this.previousEventHandler = eventHandler;
    }

    returnToPreviousMenu() {
        engine.setEventHandler(new this.previousEventHandler.constructor());
    }
}