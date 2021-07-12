import _Tile from "./_Tile";
import SolidObject from "../components/SolidObject";
import Walkable from "../components/Walkable";
import BlocksMovement from "../components/BlocksMovement";
import BlocksFov from "../components/BlocksFov";

export default class SolidTile extends _Tile {
    constructor(args = {}) {
        super({...args, ...{type: "solidtile"}});
        const argsWithParent = {...args, ...{parentEntity: this}};
        this.setComponent(new SolidObject(argsWithParent));
        this.setComponent(new Walkable({...{walkable: true}, ...argsWithParent}));
        this.setComponent(new BlocksMovement({...{blocksMovement: true}, ...argsWithParent}));
        this.setComponent(new BlocksFov({...{blocksFov: true}, ...argsWithParent}));
    }
}