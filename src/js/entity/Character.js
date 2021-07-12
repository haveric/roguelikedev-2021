import _Entity from "./_Entity";
import helvetikerFont from "../../fonts/helvetiker_regular.typeface.json";
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
                    font: helvetikerFont,
                    xRot: .5,
                    yRot: .25,
                    xOffset: -.4,
                    yOffset: -.3,
                    zOffset: -.25
                },
                "blocksMovement": true
            }
        }
    }
}