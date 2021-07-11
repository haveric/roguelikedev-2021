import SolidObject from "./SolidObject";
import CharacterObject from "./CharacterObject";
import BlocksMovement from "./BlocksMovement";
import Walkable from "./Walkable";
import Fov from "./Fov";
import BlocksFov from "./BlocksFov";

class ComponentLoader {
    constructor() {
        this.types = new Map();

        this.load(new SolidObject());
        this.load(new CharacterObject());
        this.load(new BlocksMovement());
        this.load(new BlocksFov());
        this.load(new Walkable());
        this.load(new Fov());
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