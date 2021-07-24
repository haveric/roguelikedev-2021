import _Component from "./_Component";
import Extend from "../util/Extend";
import engine from "../Engine";
import AIDead from "./ai/AIDead";
import {TWEEN} from "three/examples/jsm/libs/tween.module.min";
import GameOverEventHandler from "../event/GameOverEventHandler";
import messageConsole from "../ui/MessageConsole";
import characterHealth from "../ui/CharacterHealth";
import characterMana from "../ui/CharacterMana";

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

    takeDamage(damage) {
        this.hp -= damage;

        if (this.isPlayer()) {
            characterHealth.update(this.hp, this.maxHp);
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

        const position = entity.getComponent("positionalobject");
        if (position) {
            const rotation = {
                xRot: position.xRot,
                yRot: position.yRot,
                zRot: position.zRot,
                zOffset: position.zOffset
            }
            const finalRotation = {
                xRot: 0,
                yRot: 0,
                zRot: Math.random() * 2,
                zOffset: 0
            };

            const tween = new TWEEN.Tween(rotation).to(finalRotation, 200);
            tween.start();
            tween.onUpdate(function() {
                position.xRot = rotation.xRot;
                position.yRot = rotation.yRot;
                position.zRot = rotation.zRot;
                position.zOffset = rotation.zOffset;
                position.updateObjectPosition();
                engine.needsMapUpdate = true;
            });
        }

        const blocksMovement = entity.getComponent("blocksMovement");
        if (blocksMovement) {
            blocksMovement.blocksMovement = false;
        }

        const inventory = entity.getComponent("inventory");
        if (inventory) {
            inventory.dropAll();
        }

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

        entity.name = "Remains of " + entity.name;

        messageConsole.build();
    }
}