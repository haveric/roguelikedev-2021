import pressStartFont from "../../fonts/Press Start 2P_Regular.json";
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
                    font: pressStartFont,
                    xOffset: -.5,
                    yOffset: -.65,
                    zOffset: -.5
                },
                "walkable": {
                    "walkable": false
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