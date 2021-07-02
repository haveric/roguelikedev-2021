import pressStartFont from "../../fonts/Press Start 2P_Regular.json";
import _Tile from "./_Tile";
import CharacterObject from "../components/CharacterObject";

export default class CharacterTile extends _Tile {
    constructor(name, x, y, z, scale, letter, color) {
        super("charactertile", name);

        this.setComponent(new CharacterObject(x, y, z, scale, pressStartFont, letter, color, {xOffset: -.5, yOffset: -.65, zOffset: -.5}));
    }
}