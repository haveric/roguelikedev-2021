import _Component from "./_Component";

export default class Faction extends _Component {
    constructor(args = {}) {
        super(args, "faction");
        const hasComponent = args.components && args.components.faction !== undefined;

        this.factions = [];
        this.enemies = [];

        if (hasComponent) {
            const faction = args.components.faction;
            if (faction.factions) {
                this.setFactions(faction.factions.split(","), false);
            }

            if (faction.enemies) {
                this.setEnemies(faction.enemies.split(","), false);
            }
        }
    }

    save() {
        if (this.cachedSave) {
            return this.cachedSave;
        }

        const saveJson = {
            "faction": {
                factions: this.factions.toString(),
                enemies: this.enemies.toString()
            }
        };

        this.cachedSave = saveJson;
        return saveJson;
    }

    setFactions(factionList, clear = true) {
        for (const faction of factionList) {
            this.factions.push(faction.trim());
        }

        if (clear) {
            this.clearSaveCache();
        }
    }

    setEnemies(enemyList, clear = true) {
        for (const enemy of enemyList) {
            this.enemies.push(enemy.trim());
        }

        if (clear) {
            this.clearSaveCache();
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