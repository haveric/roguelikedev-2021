import SolidObject from "./SolidObject";
import CharacterObject from "./CharacterObject";

class ComponentLoader {
    constructor() {
        this.types = new Map();

        this.load(new SolidObject());
        this.load(new CharacterObject());
    }

    load(component) {
        this.types.set(component.type, component.constructor);
    }

    create(type, ...args) {
        const constructor = this.types.get(type);
        return new constructor(...args);
    }
}

const componentLoader = new ComponentLoader();
export default componentLoader;