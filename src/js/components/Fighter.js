import _Component from "./_Component";
import engine from "../Engine";
import AIDead from "./ai/AIDead";
import GameOverEventHandler from "../event/GameOverEventHandler";
import messageConsole from "../ui/MessageConsole";
import characterHealth from "../ui/CharacterHealth";
import characterMana from "../ui/CharacterMana";
import {MathUtils, Vector3} from "three";
import CharacterObject from "./positionalObject/CharacterObject";
import {TWEEN} from "three/examples/jsm/libs/tween.module.min";
import sceneState from "../SceneState";
import character from "../ui/Character";

export default class Fighter extends _Component {
    constructor(args = {}) {
        super(args, "fighter");
        const hasComponent = args.components && args.components.fighter !== undefined;

        this.baseStrength = 0;
        this.baseDamage = 0;

        this.baseAgility = 0;
        this.baseDefense = 0;

        this.baseConstitution = 0;
        this.baseHp = 0;
        this.hp = null;

        this.baseWisdom = 0;
        this.baseMana = 0;
        this.mana = null;

        if (hasComponent) {
            const fighter = args.components.fighter;
            if (fighter.strength !== undefined) {
                this.baseStrength = fighter.strength;
            }

            if (fighter.agility !== undefined) {
                this.baseAgility = fighter.agility;
            }

            if (fighter.constitution !== undefined) {
                this.baseConstitution = fighter.constitution;
            }

            if (fighter.wisdom !== undefined) {
                this.baseWisdom = fighter.wisdom;
            }

            if (fighter.baseDamage !== undefined) {
                this.baseDamage = fighter.baseDamage;
            }

            if (fighter.baseDefense !== undefined) {
                this.baseDefense = fighter.baseDefense;
            }

            if (fighter.baseHp !== undefined) {
                this.baseHp = fighter.baseHp;
            }

            if (fighter.hp !== undefined) {
                this.hp = fighter.hp;
            }

            if (fighter.baseMana !== undefined) {
                this.baseMana = fighter.baseMana;
            }

            if (fighter.mana !== undefined) {
                this.mana = fighter.mana;
            }
        }

        this.minDamage = 0;
        this.maxDamage = 0;
        this.defense = 0;
        this.blockChance = 0;
        this.healingBonus = 0;
        this.strength = 0;
        this.agility = 0;
        this.constitution = 0;
        this.wisdom = 0;
    }

    save() {
        if (this.cachedSave) {
            return this.cachedSave;
        }

        const saveJson = {
            fighter: {
                hp: this.hp,
                mana: this.mana
            }
        };

        if (this.baseStrength > 0) {
            saveJson.fighter.strength = this.baseStrength;
        }
        if (this.baseAgility > 0) {
            saveJson.fighter.agility = this.baseAgility;
        }
        if (this.baseConstitution > 0) {
            saveJson.fighter.constitution = this.baseConstitution;
        }
        if (this.baseWisdom > 0) {
            saveJson.fighter.wisdom = this.baseWisdom;
        }
        if (this.baseDamage > 0) {
            saveJson.fighter.baseDamage = this.baseDamage;
        }
        if (this.baseDefense > 0) {
            saveJson.fighter.baseDefense = this.baseDefense;
        }

        this.cachedSave = saveJson;
        return saveJson;
    }

    recalculateStats(clear = true) {
        this.calculateStats();
        this.healingBonus = Math.floor(this.constitution / 2);

        const newMax = this.getMaxHp();
        if (this.hp === null || this.hp >= this.maxHp) {
            this.hp = newMax;
        }
        this.maxHp = newMax;

        const newMaxMana = this.getMaxMana();
        if (this.mana === null || this.mana >= this.maxMana) {
            this.mana = newMaxMana;
        }
        this.maxMana = newMaxMana;

        this.calculateDamage();
        this.calculateDefense();
        this.calculateBlockChance();

        this.updateUI();

        if (clear) {
            this.clearSaveCache();
        }
    }

    calculateStats() {
        let equipmentStrength = 0;
        let equipmentAgility = 0;
        let equipmentConstitution = 0;
        let equipmentWisdom = 0;
        const equipment = this.parentEntity.getComponent("equipment");
        if (equipment) {
            const equippables = equipment.getEquippables();
            for (const equippable of equippables) {
                equipmentStrength += equippable.strength;
                equipmentAgility += equippable.agility;
                equipmentConstitution += equippable.constitution;
                equipmentWisdom += equippable.wisdom;
            }
        }

        this.strength = this.baseStrength + equipmentStrength;
        this.agility = this.baseAgility + equipmentAgility;
        this.constitution = this.baseConstitution + equipmentConstitution;
        this.wisdom = this.baseWisdom + equipmentWisdom;
    }

    calculateDamage() {
        const statDamage = this.baseDamage + this.strength;

        let equipmentMinDamage = 0;
        let equipmentMaxDamage = 0;
        const equipment = this.parentEntity.getComponent("equipment");
        if (equipment) {
            const equippables = equipment.getEquippables();
            for (const equippable of equippables) {
                equipmentMinDamage += equippable.minDamage;
                equipmentMaxDamage += equippable.maxDamage;
            }
        }

        this.minDamage = statDamage + equipmentMinDamage;
        this.maxDamage = Math.floor(statDamage * 1.5) + equipmentMaxDamage;
    }

    calculateDefense() {
        const statDefense = this.baseDefense + (this.agility * 10);

        let equipmentDefense = 0;
        const equipment = this.parentEntity.getComponent("equipment");
        if (equipment) {
            const equippables = equipment.getEquippables();
            for (const equippable of equippables) {
                equipmentDefense += equippable.defense;
            }
        }

        this.defense = statDefense + equipmentDefense;
    }

    calculateBlockChance() {
        const statBlockChance = this.agility * 2;

        let equipmentBlockChance = 0;
        const equipment = this.parentEntity.getComponent("equipment");
        if (equipment) {
            const equippables = equipment.getEquippables();
            for (const equippable of equippables) {
                equipmentBlockChance += equippable.blockChance;
            }
        }

        this.blockChance = Math.min(statBlockChance + equipmentBlockChance, 90);
    }

    getDamage() {
        if (this.minDamage === this.maxDamage) {
            return this.minDamage;
        } else {
            return MathUtils.randInt(this.minDamage, this.maxDamage);
        }
    }

    getDamageDisplay() {
        if (this.minDamage === this.maxDamage) {
            return this.minDamage;
        } else {
            return this.minDamage + " - " + this.maxDamage;
        }
    }

    getBlockedDamage() {
        return Math.floor(MathUtils.randFloat(this.defense / 10, this.defense) / 10);
    }

    getMaxHp() {
        const statHp = this.baseHp + this.constitution * 15;

        let equipmentHp = 0;
        const equipment = this.parentEntity.getComponent("equipment");
        if (equipment) {
            const equippables = equipment.getEquippables();
            for (const equippable of equippables) {
                equipmentHp += equippable.health;
            }
        }

        return statHp + equipmentHp;
    }

    getMaxMana() {
        const statMana = this.baseMana + this.wisdom * 10;

        let equipmentMana = 0;
        const equipment = this.parentEntity.getComponent("equipment");
        if (equipment) {
            const equippables = equipment.getEquippables();
            for (const equippable of equippables) {
                equipmentMana += equippable.mana;
            }
        }

        return statMana + equipmentMana;
    }

    createDamageIndicator(damage, color) {
        const position = this.parentEntity.getComponent("positionalobject");
        if (position) {
            const xRand = position.x + MathUtils.randFloat(-.25, .25);
            const yRand = position.y + MathUtils.randFloat(-.25, .25);
            const zRand = position.z + 1.1 + MathUtils.randFloat(0, 1);
            const args = {
                components: {
                    characterobject: {
                        letter: "" + damage,
                        x: xRand,
                        y: yRand,
                        z: zRand,
                        xRot: .5,
                        yRot: .25,
                        zRot: 0,
                        color: color,
                        scale: .05,
                        size: .5
                    }
                }
            };

            const indicator = new CharacterObject(args);
            indicator.parentEntity = this;
            indicator.setVisible();
            const current = new Vector3(position.x, position.y, zRand);
            const target = new Vector3(position.x, position.y, zRand + 3);

            const tween = new TWEEN.Tween(current).to(target, 500);
            tween.easing(TWEEN.Easing.Cubic.In);
            tween.onUpdate(function () {
                indicator.z = current.z;
                indicator.updateObjectPosition();
                engine.needsMapUpdate = true;
            });
            tween.onComplete(function () {
                sceneState.scene.remove(indicator.object);
            });
            tween.start();
        }
    }

    takeDamage(damage) {
        this.hp -= damage;

        this.updateUI();
        if (this.isPlayer()) {
            this.createDamageIndicator(damage, "#C00");
        } else {
            this.createDamageIndicator(damage, "#999");
        }

        if (this.hp <= 0) {
            this.die();
        }

        this.clearSaveCache();
    }

    heal(amount) {
        if (this.hp === this.maxHp) {
            return 0;
        }

        const newHp = Math.min(this.maxHp, this.hp + amount);
        const healedHp = newHp - this.hp;
        this.hp = newHp;

        this.updateUI();

        this.createDamageIndicator(healedHp, "#090");
        this.clearSaveCache();

        return healedHp;
    }

    consumeMana(amount) {
        if (this.mana < amount) {
            return false;
        }

        this.mana -= amount;

        this.updateUI();

        this.clearSaveCache();
    }

    recoverMana(amount) {
        if (this.mana === this.maxMana) {
            return 0;
        }

        const newMana = Math.min(this.maxMana, this.mana + amount);
        const recoveredMana = newMana - this.mana;
        this.mana = newMana;

        this.updateUI();

        this.clearSaveCache();

        return recoveredMana;
    }

    die() {
        const entity = this.parentEntity;
        if (this.isPlayer()) {
            messageConsole.text("You died!", "#f00");
            engine.setEventHandler(new GameOverEventHandler());
        } else {
            messageConsole.text(entity.name + " dies!", "#ffa030");
        }
        messageConsole.build();

        entity.callEvent("onEntityDeath");

        const ai = entity.getComponent("ai");
        if (ai) {
            const aiType = ai.type;
            const aiArgs = {
                components: {
                    aiDead: {
                        previousAI: aiType
                    }
                }
            };
            entity.removeComponent("ai");
            const newAI = new AIDead(aiArgs);
            entity.setComponent(newAI);
        }

        this.clearSaveCache();
    }

    getHealthDescription() {
        const percent = (this.hp / this.maxHp) * 100;
        let description = "";

        if (percent >= 90 && percent < 100) {
            description = "(Barely Scratched)";
        } else if (percent >= 75 && percent < 90) {
            description = "(Lightly Damaged)";
        } else if (percent >= 50 && percent < 75) {
            description = "(Damaged)";
        } else if (percent >= 25 && percent < 50) {
            description = "(Very Damaged)";
        } else if (percent >= 10 && percent < 25) {
            description = "(Extremely Damaged)";
        } else if (percent > 0 && percent < 10) {
            description = "(Nearly Dead)";
        }

        return description;
    }

    updateUI() {
        if (this.isPlayer()) {
            characterHealth.update(this.hp, this.maxHp);
            characterMana.update(this.mana, this.maxMana);
            character.populate(engine.player);
        }
    }

    onComponentsLoaded() {
        this.recalculateStats(false);
    }

    onEquipmentChange() {
        this.recalculateStats();
    }
}