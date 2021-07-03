import SolidTile from "./SolidTile";
import CharacterTile from "./CharacterTile";
import Character from "./Character";

class EntityLoader {
    constructor() {
        this.types = new Map();

        this.load(new SolidTile());
        this.load(new CharacterTile());
        this.load(new Character());
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