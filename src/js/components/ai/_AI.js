import _Component from "../_Component";
import Extend from "../../util/Extend";
import {Vector3} from "three";
import {TWEEN} from "three/examples/jsm/libs/tween.module.min";
import engine from "../../Engine";

export default class AI extends _Component {
    constructor(args = {}) {
        super(Extend.extend(args, {baseType: "ai"}));
    }

    save() {
        return null;
    }

    perform() {
        console.err("Not Implemented");
    }

    onMeleeAttack(blockingActor) {
        const entity = this.parentEntity;
        const position = entity.getComponent("positionalobject");
        if (position) {
            entity.stopCombatAnimations();

            const blockingPosition = blockingActor.getComponent("positionalobject");
            if (blockingPosition && blockingPosition.hasObject()) {
                const originalPosition = new Vector3(position.object.position.x, position.object.position.y, position.object.position.z);
                const attackPosition = new Vector3((position.object.position.x + blockingPosition.object.position.x) / 2, (position.object.position.y + blockingPosition.object.position.y) / 2, (position.object.position.z + blockingPosition.object.position.z) / 2);
                const currentPosition = originalPosition.clone();

                const tweenAttack = new TWEEN.Tween(currentPosition).to(attackPosition, 100);
                tweenAttack.onUpdate(function () {
                    if (!position.hasObject()) {
                        this.stop();
                    }
                    position.object.position.x = currentPosition.x;
                    position.object.position.y = currentPosition.y;
                    position.object.position.z = currentPosition.z;
                    engine.needsMapUpdate = true;
                });

                const tweenReturn = new TWEEN.Tween(currentPosition).to(originalPosition, 100);
                tweenReturn.onUpdate(function () {
                    if (!position.hasObject()) {
                        this.stop();
                    }
                    position.object.position.x = currentPosition.x;
                    position.object.position.y = currentPosition.y;
                    position.object.position.z = currentPosition.z;
                    engine.needsMapUpdate = true;
                });

                tweenAttack.chain(tweenReturn);
                tweenAttack.start();

                entity.combatTweens.push(tweenAttack);
                entity.combatTweens.push(tweenReturn);
            }
        }
    }

    onEntityMove() {
        const entity = this.parentEntity;
        entity.stopCombatAnimations();
    }
}