import engine from "../Engine";

export default class Action {
    constructor(entity) {
        this.entity = entity;
    }

    /**
     *
     * @returns {Action}
     */
    perform() {
        console.error("Not Implemented");
    }

    isPlayer() {
        return this.entity === engine.player;
    }
}