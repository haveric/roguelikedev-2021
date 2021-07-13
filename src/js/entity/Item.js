import _Entity from "./_Entity";
import Extend from "../util/Extend";

export default class Item extends _Entity {
    constructor(args = {}) {
        super(Extend.deep(Item.getDefaultTemplate(), args));
    }

    static getDefaultTemplate() {
        return {
            type: "item",
            components: {
                "characterobject": {
                    scale: .1,
                    font: "helvetiker"
                }
            }
        }
    }
}