import entityGroups from "../../../json/generation/_entityGroups.json";
import itemGroups from "../../../json/generation/_itemGroups.json";
import basicDungeon from "../../../json/generation/basic-dungeon.json";
import {MathUtils} from "three";

class ChanceLoader {
    constructor() {
        this.entityGroups = new Map();
        this.itemGroups = new Map();
        this.generators = new Map();

        this.loadEntityGroups(entityGroups);
        this.loadItemGroups(itemGroups);

        this.loadGenerator("basic-dungeon", basicDungeon);
    }

    loadEntityGroups(entityGroups) {
        for (const group of entityGroups) {
            this.entityGroups.set(group.id, group.entities);
        }
    }

    loadItemGroups(itemGroups) {
        for (const group of itemGroups) {
            this.itemGroups.set(group.id, group.items);
        }
    }

    loadGenerator(name, generator) {
        this.generators.set(name, generator);
    }

    getChancesForLevel(name, level) {
        let chances;
        const generator = this.generators.get(name);
        for (const group of generator) {
            if (group.level > level) {
                break;
            }

            chances = group;
        }

        return chances;
    }

    getActorForLevel(name, level) {
        const chances = this.getChancesForLevel(name, level);
        const actors = chances.actors;

        let actorOrGroup = this.getRandomFromGroup(actors);
        while (actorOrGroup.group !== undefined) {
            const actorGroup = this.entityGroups.get(actorOrGroup.group);
            actorOrGroup = this.getRandomFromGroup(actorGroup);
        }

        return actorOrGroup.id;
    }

    getItemForLevel(name, level) {
        const chances = this.getChancesForLevel(name, level);
        const items = chances.items;

        let itemOrGroup = this.getRandomFromGroup(items);
        while (itemOrGroup.group !== undefined) {
            const itemGroup = this.itemGroups.get(itemOrGroup.group);
            itemOrGroup = this.getRandomFromGroup(itemGroup);
        }

        return itemOrGroup.id;
    }

    getRandomFromGroup(group) {
        let totalWeight = 0;
        for (const chance of group) {
            totalWeight += chance.weight;
        }

        let returnChance;
        let currentWeight = 0;
        const rand = MathUtils.randFloat(0, totalWeight);
        for (const chance of group) {
            currentWeight += chance.weight;

            if (rand < currentWeight) {
                returnChance = chance;
                break;
            }
        }

        return returnChance;
    }
}

const chanceLoader = new ChanceLoader();
export default chanceLoader;