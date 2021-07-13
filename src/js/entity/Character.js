import _Entity from "./_Entity";
import Extend from "../util/Extend";

export default class Character extends _Entity {
    constructor(args = {}) {
        super(Extend.deep(Character.getDefaultTemplate(), args));
    }

    static getDefaultTemplate() {
        return {
            type: "character",
            components: {
                "characterobject": {
                    scale: .1,
                    fontName: "helvetiker",
                    xRot: .5,
                    yRot: .25,
                    zOffset: .5
                },
                "blocksMovement": true
            }
        }
    }
}