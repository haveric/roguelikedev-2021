import SolidObject from "./SolidObject";
import CharacterObject from "./CharacterObject";
import BlocksMovement from "./BlocksMovement";
import Walkable from "./Walkable";
import Fov from "./Fov";
import BlocksFov from "./BlocksFov";
import Openable from "./Openable";

class ComponentLoader {
    constructor() {
        this.types = new Map();

        this.load(new BlocksFov());
        this.load(new BlocksMovement());
        this.load(new CharacterObject());
        this.load(new Fov());
        this.load(new Openable());
        this.load(new SolidObject());
        this.load(new Walkable());
    }

    load(component) {
        this.types.set(component.type, component);
    }

    create(type, args) {
        const constructor = this.types.get(type).constructor;
        return new constructor(args);
    }
}

const componentLoader = new ComponentLoader();
export default componentLoader;