import _Entity from "./_Entity";
import CharacterObject from "../components/CharacterObject";
import helvetikerFont from "../../fonts/helvetiker_regular.typeface.json";

export default class Character extends _Entity {
    constructor(args = {}) {
        super({...args, ...{type: "character"}});
        this.setComponent(new CharacterObject({...args, ...{parent: this, scale: .1, font: helvetikerFont, xRot: .5, yRot: .25, xOffset: -.4, yOffset: -.3, zOffset: -.25}}));
    }
}