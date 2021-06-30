import _Tile from "./_Tile";
import SolidObject from "../components/SolidObject";

export default class SolidTile extends _Tile {
    constructor(name, x, y, z, scale, color) {
        super("solidtile", name);

        this.setComponent(new SolidObject(x, y, z, scale, color))
    }
}