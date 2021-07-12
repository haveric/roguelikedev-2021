import _Tile from "./_Tile";
import Extend from "../util/Extend";

export default class SolidTile extends _Tile {
    constructor(args = {}) {
        super(Extend.deep(SolidTile.getDefaultTemplate(), args));
    }

    static getDefaultTemplate() {
        return {
            type: "solidtile",
            components: {
                "solidobject": {},
                "walkable": true,
                "blocksMovement": true,
                "blocksFov": true
            }
        }
    }
}