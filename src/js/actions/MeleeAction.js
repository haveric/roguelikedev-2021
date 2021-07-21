import ActionWithDirection from "./_ActionWithDirection";
import UnableToPerformAction from "./UnableToPerformAction";
import engine from "../Engine";
import messageConsole from "../ui/MessageConsole";
import {TWEEN} from "three/examples/jsm/libs/tween.module.min";
import {MathUtils, Vector3} from "three";
import CharacterObject from "../components/CharacterObject";
import sceneState from "../SceneState";

export default class MeleeAction extends ActionWithDirection {
    constructor(dx, dy, dz) {
        super(dx, dy, dz);
    }

    perform(entity) {
        const position = entity.getComponent("positionalobject");
        if (!position) {
            return new UnableToPerformAction("Entity doesn't have a position.");
        }

        const destX = position.x + this.dx;
        const destY = position.y + this.dy;
        const destZ = position.z + this.dz;

        const blockingActor = engine.gameMap.getBlockingActorAtLocation(destX, destY, destZ);
        if (blockingActor) {
            const entityFighter = entity.getComponent("fighter");
            const blockingFighter = blockingActor.getComponent("fighter");
            if (entityFighter && blockingFighter) {
                const damage = entityFighter.power - blockingFighter.defense;

                let name;
                let plural;
                if (entity === engine.player) {
                    name = "You";
                    plural = "";
                } else {
                    name = entity.name;
                    plural = "s"
                }

                let blockingName;
                let attackColor;
                if (blockingActor === engine.player) {
                    blockingName = "You";
                    attackColor = "#C00";
                } else {
                    blockingName = blockingActor.name;
                    attackColor = "#999";
                }

                let description = name + " attack" + plural + " " + blockingName;
                if (damage > 0) {
                    messageConsole.text(description + " for " + damage + " hit points.", attackColor).build();
                    blockingFighter.takeDamage(damage);
                } else {
                    messageConsole.text(description + ", but does no damage.", attackColor).build();
                }

                if (entity.tweenAttack) {
                    entity.tweenAttack.stop();
                }

                if (entity.tweenReturn) {
                    entity.tweenReturn.stop();
                }

                position.updateObjectPosition();

                const blockingPosition = blockingActor.getComponent("positionalobject");

                const originalPosition = new Vector3(position.object.position.x, position.object.position.y, position.object.position.z);
                const attackPosition = new Vector3((position.object.position.x + blockingPosition.object.position.x) / 2, (position.object.position.y + blockingPosition.object.position.y) / 2, (position.object.position.z + blockingPosition.object.position.z) / 2);
                const currentPosition = originalPosition.clone();

                entity.tweenAttack = new TWEEN.Tween(currentPosition).to(attackPosition, 100);
                entity.tweenAttack.onUpdate(function() {
                    position.object.position.x = currentPosition.x;
                    position.object.position.y = currentPosition.y;
                    position.object.position.z = currentPosition.z;
                    engine.needsMapUpdate = true;
                });

                entity.tweenReturn = new TWEEN.Tween(currentPosition).to(originalPosition, 100);
                entity.tweenReturn.onUpdate(function() {
                    position.object.position.x = currentPosition.x;
                    position.object.position.y = currentPosition.y;
                    position.object.position.z = currentPosition.z;
                    engine.needsMapUpdate = true;
                });

                entity.tweenAttack.chain(entity.tweenReturn);
                entity.tweenAttack.start();

                this.createDamageIndicator(blockingPosition, damage, attackColor);
            }
        } else {
            return new UnableToPerformAction("There's nothing to attack there!");
        }
    }

    createDamageIndicator(position, damage, attackColor) {
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
                    xRot: position.xRot,
                    yRot: position.yRot,
                    zRot: position.zRot,
                    color: attackColor,
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
        tween.onUpdate(function() {
            indicator.z = current.z;
            indicator.updateObjectPosition();
            engine.needsMapUpdate = true;
        });
        tween.onComplete(function() {
            sceneState.scene.remove(indicator.object);
        });
        tween.start();
    }
}