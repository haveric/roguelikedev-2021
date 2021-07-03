import _Tile from "./_Tile";
import SolidObject from "../components/SolidObject";

export default class SolidTile extends _Tile {
    constructor(args = {}) {
        super({...args, ...{type: "solidtile"}});
        this.setComponent(new SolidObject({...args, ...{parent: this}}));
    }
}