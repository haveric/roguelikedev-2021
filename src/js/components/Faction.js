import _Component from "./_Component";
import Extend from "../util/Extend";

export default class Faction extends _Component {
    constructor(args = {}) {
        super(Extend.extend(args, {baseType: "faction"}));
        const hasComponent = args.components && args.components.faction !== undefined;

        this.factions = [];
        this.enemies = [];

        if (hasComponent) {
            const faction = args.components.faction;
            if (faction.factions) {
                this.setFactions(faction.factions.split(","));
            }

            if (faction.enemies) {
                this.setEnemies(faction.enemies.split(","));
            }
        }
    }

    save() {
        return {
            "faction": {
                factions: this.factions.toString(),
                enemies: this.enemies.toString()
            }
        }
    }

    setFactions(factionList) {
        for (const faction of factionList) {
            this.factions.push(faction.trim());
        }
    }

    setEnemies(enemyList) {
        for (const enemy of enemyList) {
            this.enemies.push(enemy.trim());
        }
    }

    /**
     *
     * @param {Faction} otherFaction
     */
    isEnemyOf(otherFaction) {
        if (!otherFaction) {
            return false;
        }

        for (const faction of this.factions) {
            if (otherFaction.enemies.indexOf(faction) > -1) {
                return true;
            }
        }

        return false;
    }
}