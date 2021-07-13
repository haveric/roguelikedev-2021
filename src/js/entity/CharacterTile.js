import _Tile from "./_Tile";
import Extend from "../util/Extend";

export default class CharacterTile extends _Tile {
    constructor(args = {}) {
        super(Extend.deep(CharacterTile.getDefaultTemplate(), args));
    }

    static getDefaultTemplate() {
        return {
            type: "charactertile",
            components: {
                "characterobject": {
                    fontName: "pressStart"
                },
                "walkable": false,
                "blocksMovement": true,
                "blocksFov": true
            }
        }
    }
}