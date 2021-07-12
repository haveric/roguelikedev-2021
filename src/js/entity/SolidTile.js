import _Tile from "./_Tile";
import jquery from "jquery";

export default class SolidTile extends _Tile {
    constructor(args = {}) {
        super(jquery.extend(true, SolidTile.getDefaultTemplate(), args));
    }

    static getDefaultTemplate() {
        return {
            type: "solidtile",
            components: {
                "solidobject": {},
                "walkable": {
                    "walkable": true
                },
                "blocksMovement": {
                    "blocksMovement": true
                },
                "blocksFov": {
                    "blocksFov": true
                }
            }
        }
    }
}