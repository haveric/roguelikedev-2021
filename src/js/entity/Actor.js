import _Entity from "./_Entity";

export default class Actor extends _Entity {
    constructor(args = {}) {
        super(args, "actor");
    }

    isAlive() {
        const fighter = this.getComponent("fighter");
        return fighter && fighter.hp > 0;
    }

    clone() {
        return new Actor(this.save());
    }
}