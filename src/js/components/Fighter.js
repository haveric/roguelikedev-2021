import _Component from "./_Component";
import Extend from "../util/Extend";
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

export default class Fighter extends _Component {
    constructor(args = {}) {
        super(Extend.extend(args, {baseType: "fighter"}));
        const hasComponent = args.components && args.components.fighter !== undefined;

        this.strength = 0;
        this.baseDamage = 0;

        this.agility = 0;
        this.baseDefense = 0;

        this.constitution = 0;
        this.baseHp = 0;
        this.hp = null;

        this.wisdom = 0;
        this.baseMana = 0;
        this.mana = null;

        if (hasComponent) {
            const fighter = args.components.fighter;
            if (fighter.strength !== undefined) {
                this.strength = fighter.strength;
            }

            if (fighter.agility !== undefined) {
                this.agility = fighter.agility;
            }

            if (fighter.constitution !== undefined) {
                this.constitution = fighter.constitution;
            }

            if (fighter.wisdom !== undefined) {
                this.wisdom = fighter.wisdom;
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

        this.recalculateStats();
    }

    save() {
        if (this.cachedSave) {
            return this.cachedSave;
        }

        let saveJson = {
            fighter: {
                hp: this.hp,
                mana: this.mana
            }
        };

        if (this.strength > 0) {
            saveJson.fighter.strength = this.strength;
        }
        if (this.agility > 0) {
            saveJson.fighter.agility = this.agility;
        }
        if (this.constitution > 0) {
            saveJson.fighter.constitution = this.constitution;
        }
        if (this.wisdom > 0) {
            saveJson.fighter.wisdom = this.wisdom;
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

    recalculateStats() {
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

        this.clearSaveCache();
    }

    getDamage() {
        return this.baseDamage + this.strength;
    }

    getBlockedDamage() {
        return this.baseDefense + this.agility;
    }

    getMaxHp() {
        return this.baseHp + this.constitution * 15;
    }

    getMaxMana() {
        return this.baseMana + this.wisdom * 10;
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
            }

            const indicator = new CharacterObject(args);
            indicator.parentEntity = this;
            indicator.setVisible();
            const current = new Vector3(position.x, position.y, zRand);
            const target = new Vector3(position.x, position.y, zRand + 3)

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

        if (this.isPlayer()) {
            characterHealth.update(this.hp, this.maxHp);
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

        if (this.isPlayer()) {
            characterHealth.update(this.hp, this.maxHp);
        }

        this.createDamageIndicator(healedHp, "#090");
        this.clearSaveCache();

        return healedHp;
    }

    consumeMana(amount) {
        if (this.mana < amount) {
            return false;
        }

        this.mana -= amount;

        if (this.isPlayer()) {
            characterMana.update(this.mana, this.maxMana);
        }

        this.clearSaveCache();
    }

    recoverMana(amount) {
        if (this.mana === this.maxMana) {
            return 0;
        }

        const newMana = Math.min(this.maxMana, this.mana + amount);
        const recoveredMana = newMana - this.mana;
        this.mana = newMana;

        if (this.isPlayer()) {
            characterMana.update(this.mana, this.maxMana);
        }

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
            }
            entity.removeComponent("ai");
            const newAI = new AIDead(aiArgs);
            entity.setComponent(newAI);
        }

        this.clearSaveCache();
    }

    getDamageDescription() {
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
}