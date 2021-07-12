import _Entity from "./_Entity";
import helvetikerFont from "../../fonts/helvetiker_regular.typeface.json";
import jquery from "jquery";

export default class Item extends _Entity {
    constructor(args = {}) {
        super(jquery.extend(true, Item.getDefaultTemplate(), args));
    }

    static getDefaultTemplate() {
        return {
            type: "item",
            components: {
                "characterobject": {
                    scale: .1,
                    font: helvetikerFont,
                    xOffset: -.4,
                    yOffset: -.3,
                    zOffset: -.5
                }
            }
        }
    }
}