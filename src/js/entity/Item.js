import _Entity from "./_Entity";
import CharacterObject from "../components/CharacterObject";
import helvetikerFont from "../../fonts/helvetiker_regular.typeface.json";

export default class Item extends _Entity {
    constructor(args = {}) {
        super({...args, ...{type: "item"}});
        this.setComponent(new CharacterObject({...args, ...{parent: this, scale: .1, font: helvetikerFont, xOffset: -.4, yOffset: -.3, zOffset: -.5}}));
    }
}