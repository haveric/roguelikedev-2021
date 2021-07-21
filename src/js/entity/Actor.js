import _Entity from "./_Entity";
import Extend from "../util/Extend";

export default class Actor extends _Entity {
    constructor(args = {}) {
        super(Extend.deep(Actor.getDefaultTemplate(), args));
    }

    static getDefaultTemplate() {
        return {
            type: "actor",
            components: {
                "characterobject": {
                    scale: .1,
                    fontName: "helvetiker",
                    xRot: .5,
                    yRot: .25,
                    zOffset: .5
                },
                "blocksMovement": true,
                "fighter": {}
            }
        }
    }

    isAlive() {
        const fighter = this.getComponent("fighter");
        return fighter && fighter.hp > 0;
    }

    clone() {
        return new Actor(this.save());
    }
}