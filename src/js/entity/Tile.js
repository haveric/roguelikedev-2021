import _Entity from "./_Entity";
import Extend from "../util/Extend";

export default class Tile extends _Entity {
    constructor(args = {}) {
        super(Extend.deep(Tile.getDefaultTemplate(), args));
    }

    static getDefaultTemplate() {
        return {type: "tile"};
    }

    clone() {
        return new Tile(this.save());
    }
}