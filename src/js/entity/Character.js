import _Entity from "./_Entity";
import CharacterObject from "../components/CharacterObject";
import helvetikerFont from "../../fonts/helvetiker_regular.typeface.json";
import BlocksMovement from "../components/BlocksMovement";

export default class Character extends _Entity {
    constructor(args = {}) {
        super({...args, ...{type: "character"}});
        const argsWithParent = {...args, ...{parent: this}};
        this.setComponent(new CharacterObject({...{scale: .1, font: helvetikerFont, xRot: .5, yRot: .25, xOffset: -.4, yOffset: -.3, zOffset: -.25}, ...argsWithParent }));
        this.setComponent(new BlocksMovement({...{blocksMovement: true}, ...argsWithParent}));
    }
}