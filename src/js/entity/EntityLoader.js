import SolidTile from "./SolidTile";
import CharacterTile from "./CharacterTile";
import Character from "./Character";
import Item from "./Item";
import playerList from "../../json/actors/player.json";
import enemyList from "../../json/actors/enemies.json";
import npcsList from "../../json/actors/npcs.json";
import tileList from "../../json/tiles/tiles.json";
import jquery from "jquery";

class EntityLoader {
    constructor() {
        this.types = new Map();
        this.templates = new Map();

        this.load(new SolidTile());
        this.load(new CharacterTile());
        this.load(new Character());
        this.load(new Item());

        this.loadTemplates();
    }

    load(entity) {
        this.types.set(entity.type, entity);
    }

    create(json, args = {}) {
        const parsedJson = JSON.parse(json);
        const entity = this.types.get(parsedJson.type);
        return new entity.constructor(jquery.extend(true, parsedJson, args));
    }

    loadTemplates() {
        this.loadTemplate(playerList);
        this.loadTemplate(enemyList);
        this.loadTemplate(npcsList);
        this.loadTemplate(tileList);
    }

    loadTemplate(entities) {
        for (const entity of entities) {
            const name = entity.name;
            if (this.templates.has(name)) {
                console.error("Template for entity '" + name + "' already exists.");
            } else {
                this.templates.set(name, JSON.stringify(entity));
            }
        }
    }

    createFromTemplate(name, args = {}) {
        if (this.templates.has(name)) {
            const template = this.templates.get(name);

            return this.create(template, args);
        }

        return null;
    }
}

const entityLoader = new EntityLoader();
export default entityLoader;