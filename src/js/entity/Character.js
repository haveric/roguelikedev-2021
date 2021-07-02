import _Entity from "./_Entity";
import CharacterObject from "../components/CharacterObject";
import helvetikerFont from "../../fonts/helvetiker_regular.typeface.json";

export default class Character extends _Entity {
    constructor(name, x, y, z, letter, color) {
        super("character", name);
        this.setComponent(new CharacterObject(x, y, z, .1, helvetikerFont, letter, color, {xRot: .5, yRot: .25, xOffset: -.4, yOffset: -.3, zOffset: -.25}));
    }
}