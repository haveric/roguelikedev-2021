import _Entity from "./_Entity";
import Extend from "../util/Extend";

export default class Actor extends _Entity {
    constructor(args = {}) {
        super(Extend.deep(Actor.getDefaultTemplate(), args));
    }

    static getDefaultTemplate() {
        return {type: "actor"};
    }

    isAlive() {
        const fighter = this.getComponent("fighter");
        return fighter && fighter.hp > 0;
    }

    clone() {
        return new Actor(this.save());
    }
}