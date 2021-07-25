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

        this.hp = 30;
        this.maxHp = 30;
        this.mana = 20;
        this.maxMana = 20;
        this.defense = 0;
        this.power = 2;

        if (hasComponent) {
            const fighter = args.components.fighter;
            if (fighter.hp !== undefined) {
                this.hp = fighter.hp;
            }

            if (fighter.maxHp !== undefined) {
                this.maxHp = fighter.maxHp;
            }

            if (fighter.mana !== undefined) {
                this.mana = fighter.mana;
            }

            if (fighter.maxMana !== undefined) {
                this.maxMana = fighter.maxMana;
            }

            if (fighter.defense !== undefined) {
                this.defense = fighter.defense;
            }

            if (fighter.power !== undefined) {
                this.power = fighter.power;
            }
        }
    }

    save() {
        return {
            fighter: {
                hp: this.hp,
                maxHp: this.maxHp,
                mana: this.mana,
                maxMana: this.maxMana,
                defense: this.defense,
                power: this.power
            }
        }
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
    }
}