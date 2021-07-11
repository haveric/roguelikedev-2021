import pressStartFont from "../../fonts/Press Start 2P_Regular.json";
import _Tile from "./_Tile";
import CharacterObject from "../components/CharacterObject";
import Walkable from "../components/Walkable";
import BlocksMovement from "../components/BlocksMovement";
import BlocksFov from "../components/BlocksFov";

export default class CharacterTile extends _Tile {
    constructor(args = {}) {
        super({...args, ...{type: "charactertile"}});
        const argsWithParent = {...args, ...{parent: this}};
        this.setComponent(new CharacterObject({...{font: pressStartFont, xOffset: -.5, yOffset: -.65, zOffset: -.5}, ...argsWithParent}));
        this.setComponent(new Walkable({...{walkable: false}, ...argsWithParent}));
        this.setComponent(new BlocksMovement({...{blocksMovement: true}, ...argsWithParent}));
        this.setComponent(new BlocksFov({...{blocksFov: true}, ...argsWithParent}));
    }
}