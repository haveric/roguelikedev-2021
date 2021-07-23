import engine from "../Engine";

export default class Action {
    constructor(entity) {
        this.entity = entity;
    }

    perform() {
        console.err("Not Implemented");
    }

    isPlayer() {
        return this.entity === engine.player;
    }
}