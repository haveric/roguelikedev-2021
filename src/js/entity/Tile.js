import _Entity from "./_Entity";

export default class Tile extends _Entity {
    constructor(args = {}) {
        super(args, "tile");
    }

    clone() {
        return new Tile(this.save());
    }
}