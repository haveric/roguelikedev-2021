import pressStartFont from "../../fonts/Press Start 2P_Regular.json";
import _Tile from "./_Tile";
import CharacterObject from "../components/CharacterObject";

export default class CharacterTile extends _Tile {
    constructor(args = {}) {
        super({...args, ...{type: "charactertile"}});

        this.setComponent(new CharacterObject({...args, ...{parent: this, font: pressStartFont, xOffset: -.5, yOffset: -.65, zOffset: -.5}}));
    }
}