import ActionWithDirection from "./_ActionWithDirection";
import UnableToPerformAction from "./UnableToPerformAction";
import engine from "../Engine";
import messageConsole from "../ui/MessageConsole";
import {TWEEN} from "three/examples/jsm/libs/tween.module.min";
import {Vector3} from "three";

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
                const attackPosition = new Vector3(blockingPosition.object.position.x, blockingPosition.object.position.y, blockingPosition.object.position.z);
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
            }
        } else {
            return new UnableToPerformAction("There's nothing to attack there!");
        }
    }
}