import _Component from "./_Component";
import Extend from "../util/Extend";
import messageConsole from "../ui/MessageConsole";
import engine from "../Engine";
import character from "../ui/Character";
import bottomContainer from "../ui/BottomContainer";

export default class Level extends _Component {
    constructor(args = {}) {
        super(Extend.extend(args, {baseType: "level"}));

        const hasComponent = args.components && args.components.level !== undefined;

        this.level = 1;
        this.xp = 0;
        this.xpGiven = 0;
        this.statPointsAvailable = 0;
        this.skillPointsAvailable = 0;

        this.statPointsPerLevel = 1;
        this.skillPointsPerLevel = 1;

        if (hasComponent) {
            const level = args.components.level;
            if (level.level !== undefined) {
                this.level = level.level;
            }

            if (level.xp !== undefined) {
                this.xp = level.xp;
            }

            if (level.xpGiven !== undefined) {
                this.xpGiven = level.xpGiven;
            }

            if (level.statPointsAvailable !== undefined) {
                this.statPointsAvailable = level.statPointsAvailable;
            }

            if (level.skillPointsAvailable !== undefined) {
                this.skillPointsAvailable = level.skillPointsAvailable;
            }
        }
    }

    save() {
        if (this.cachedSave) {
            return this.cachedSave;
        }

        const saveJson = {
            level: {}
        };

        if (this.level > 1) {
            saveJson.level = this.level;
        }

        if (this.xp > 0) {
            saveJson.xp = this.xp;
        }

        if (this.xpGiven > 0) {
            saveJson.xpGiven = this.xpGiven;
        }

        if (this.statPointsAvailable > 0) {
            saveJson.statPointsAvailable = this.statPointsAvailable;
        }

        if (this.skillPointsAvailable > 0) {
            saveJson.skillPointsAvailable = this.skillPointsAvailable;
        }

        this.cachedSave = saveJson;
        return saveJson;
    }

    xpForLevel(level) {
        return 75 * ((level * level) + level);
    }

    requiresLevelUp() {
        return this.xp >= this.xpForLevel(this.level);
    }

    getPercentXPTowardsLevel() {
        const previousLevelXp = this.xpForLevel(this.level - 1);
        const levelXpAdjusted = this.xpForLevel(this.level) - previousLevelXp;
        const xpAdjusted = this.xp - previousLevelXp;
        return (xpAdjusted / levelXpAdjusted) * 100;
    }

    levelUp() {
        this.level += 1;
        this.statPointsAvailable += this.statPointsPerLevel;
        this.skillPointsAvailable += this.skillPointsPerLevel;
        messageConsole.text("You are now level " + this.level + "!").build();

        const fighter = this.parentEntity.getComponent("fighter");
        fighter.heal(fighter.maxHp);
        fighter.recoverMana(fighter.maxMana);

        bottomContainer.updateStatPointsIndicator();
        bottomContainer.updateSkillPointsIndicator();
        this.clearSaveCache();
    }

    useStatPoint() {
        this.statPointsAvailable -= 1;
        character.populate(engine.player);

        bottomContainer.updateStatPointsIndicator();
        this.clearSaveCache();
    }

    useSkillPoint() {
        this.skillPointsAvailable -= 1;
        //skills.populate(engine.player);

        bottomContainer.updateSkillPointsIndicator();
        this.clearSaveCache();
    }

    addXp(amount) {
        if (amount <= 0) {
            return;
        }

        this.xp += amount;
        messageConsole.text("You gain " + amount + " xp.").build();

        if (this.requiresLevelUp()) {
            this.levelUp();
        }

        if (character.isOpen()) {
            character.populate(engine.player);
        }

        bottomContainer.updateXp();
        this.clearSaveCache();
    }

    onEntityDeath() {
        if (engine.player && !this.isPlayer()) {
            const level = engine.player.getComponent("level");
            level.addXp(this.xpGiven);
        }
    }
}