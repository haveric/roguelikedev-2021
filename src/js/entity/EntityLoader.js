import SolidTile from "./SolidTile";
import CharacterTile from "./CharacterTile";
import Character from "./Character";
import Item from "./Item";

class EntityLoader {
    constructor() {
        this.types = new Map();

        this.load(new SolidTile());
        this.load(new CharacterTile());
        this.load(new Character());
        this.load(new Item());
    }

    load(entity) {
        this.types.set(entity.type, entity);
    }

    create(json, args = {}) {
        const parsedJson = JSON.parse(json);
        const entity = this.types.get(parsedJson.type);
        return new entity.constructor({...args, ...parsedJson});
    }
}

const entityLoader = new EntityLoader();
export default entityLoader;