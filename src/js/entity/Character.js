import _Entity from "./_Entity";
import helvetikerFont from "../../fonts/helvetiker_regular.typeface.json";
import jquery from "jquery";

export default class Character extends _Entity {
    constructor(args = {}) {
        super(jquery.extend(true, Character.getDefaultTemplate(), args));
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
                "blocksMovement": {
                    "blocksMovement": true
                }
            }
        }
    }
}