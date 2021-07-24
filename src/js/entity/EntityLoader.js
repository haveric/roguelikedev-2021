import SolidTile from "./SolidTile";
import CharacterTile from "./CharacterTile";
import Actor from "./Actor";
import Item from "./Item";
import playerList from "../../json/actors/player.json";
import enemyList from "../../json/actors/enemies.json";
import npcsList from "../../json/actors/npcs.json";
import tileList from "../../json/tiles/tiles.json";
import armorList from "../../json/items/armor.json";
import miscList from "../../json/items/misc.json";
import potionsList from "../../json/items/potions.json";
import scrollsList from "../../json/items/scrolls.json";
import Extend from "../util/Extend";

class EntityLoader {
    constructor() {
        this.types = new Map();
        this.templates = new Map();

        this.load(new SolidTile());
        this.load(new CharacterTile());
        this.load(new Actor());
        this.load(new Item());

        this.loadTemplates();
    }

    load(entity) {
        this.types.set(entity.type, entity);
    }

    create(json, args = {}) {
        const parsedJson = JSON.parse(json);
        const entity = this.types.get(parsedJson.type);
        return new entity.constructor(Extend.deep(parsedJson, args));
    }

    loadTemplates() {
        this.loadTemplate(playerList);
        this.loadTemplate(enemyList);
        this.loadTemplate(npcsList);
        this.loadTemplate(tileList);
        this.loadTemplate(armorList);
        this.loadTemplate(miscList);
        this.loadTemplate(potionsList);
        this.loadTemplate(scrollsList);
    }

    loadTemplate(entities) {
        for (const entity of entities) {
            const id = entity.id;
            if (this.templates.has(id)) {
                console.error("Template for entity id '" + id + "' already exists.");
            } else {
                this.templates.set(id, JSON.stringify(entity));
            }
        }
    }

    createFromTemplate(id, args = {}) {
        if (this.templates.has(id)) {
            const template = this.templates.get(id);

            return this.create(template, args);
        } else {
            console.error("Json template for id '" + id + "' is missing.");
        }

        return null;
    }
}

const entityLoader = new EntityLoader();
export default entityLoader;