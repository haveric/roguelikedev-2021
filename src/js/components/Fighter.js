import _Component from "./_Component";
import Extend from "../util/Extend";
import engine from "../Engine";
import AIDead from "./ai/AIDead";
import {TWEEN} from "three/examples/jsm/libs/tween.module.min";

export default class Fighter extends _Component {
    constructor(args = {}) {
        super(Extend.extend(args, {baseType: "fighter"}));
        const hasComponent = args.components && args.components.fighter !== undefined;

        this.hp = 30;
        this.maxHp = 30;
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
                defense: this.defense,
                power: this.power
            }
        }
    }

    takeDamage(damage) {
        this.hp -= damage;

        if (this.hp < 0) {
            this.die();
        }
    }

    die() {
        let deathMessage;
        const entity = this.parentEntity;
        if (entity === engine.player) {
            deathMessage = "You died!";
        } else {
            deathMessage = entity.name + " is dead!";
        }

        const position = entity.getComponent("positionalobject");
        if (position) {
            position.color = "#BF0000";
            position.letter = "%";

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
            const newAI = new AIDead(aiArgs);
            entity.setComponent(newAI);
        }

        entity.name = "Remains of " + entity.name;

        console.log(deathMessage);
    }
}