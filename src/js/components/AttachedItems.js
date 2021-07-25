import _Component from "./_Component";
import Extend from "../util/Extend";
import {Vector3} from "three";
import {TWEEN} from "three/examples/jsm/libs/tween.module.min";
import engine from "../Engine";
import entityLoader from "../entity/EntityLoader";
import sceneState from "../SceneState";

export default class AttachedItems extends _Component {
    constructor(args = {}) {
        super(Extend.extend(args, {baseType: "attachedItems"}));

        this.items = [];
        const hasComponent = args.components && args.components.attachedItems !== undefined;

        if (hasComponent) {
            const attachedItems = args.components.attachedItems;
            if (attachedItems.items !== undefined) {
                for (let i = 0; i < attachedItems.items.length; i++) {
                    const item = attachedItems.items[i];
                    if (item !== null) {
                        this.items[i] = entityLoader.create(item);
                        this.items[i].parent = this;
                    }
                }
            }
        }
    }

    save() {
        const itemJson = [];
        for (const item of this.items) {
            if (!item) {
                itemJson.push(null);
            } else {
                itemJson.push(JSON.stringify(item.save()));
            }
        }

        return {
            attachedItems: {
                items: itemJson
            }
        }
    }

    add(item) {
        if (this.items.indexOf(item) === -1) {
            this.items.push(item);
            return true;
        } else {
            return false;
        }
    }

    clearItems() {
        this.items = [];
    }

    remove(item) {
        const index = this.items.indexOf(item);
        if (index > -1) {
            this.items.splice(index, 1);
        }
    }

    onMeleeAttack(blockingActor) {
        for (const item of this.items) {
            this.animateEntity(item, blockingActor);
        }
    }

    animateEntity(entity, blockingActor) {
        const position = entity.getComponent("positionalobject");
        if (position && position.hasObject()) {
            entity.stopCombatAnimations();

            const blockingPosition = blockingActor.getComponent("positionalobject");
            if (blockingPosition && blockingPosition.hasObject()) {
                const originalPosition = new Vector3(position.object.position.x, position.object.position.y, position.object.position.z);
                const attackPosition = new Vector3((position.object.position.x + blockingPosition.object.position.x) / 2, (position.object.position.y + blockingPosition.object.position.y) / 2, (position.object.position.z + blockingPosition.object.position.z) / 2);
                const currentPosition = originalPosition.clone();

                const tweenAttack = new TWEEN.Tween(currentPosition).to(attackPosition, 100);
                tweenAttack.onUpdate(function () {
                    if (position.hasObject()) {
                        position.object.position.x = currentPosition.x;
                        position.object.position.y = currentPosition.y;
                        position.object.position.z = currentPosition.z;
                        engine.needsMapUpdate = true;
                    } else {
                        this.stop();
                    }
                });

                const tweenReturn = new TWEEN.Tween(currentPosition).to(originalPosition, 100);
                tweenReturn.onUpdate(function () {
                    if (position.hasObject()) {
                        position.object.position.x = currentPosition.x;
                        position.object.position.y = currentPosition.y;
                        position.object.position.z = currentPosition.z;
                        engine.needsMapUpdate = true;
                    } else {
                        this.stop();
                    }
                });

                tweenAttack.chain(tweenReturn);
                tweenAttack.start();

                entity.combatTweens.push(tweenAttack);
            }
        }
    }

    onEntityMove() {
        for (const item of this.items) {
            item.stopCombatAnimations();
        }

        const entity = this.parentEntity;
        const entityPosition = entity.getComponent("positionalobject");
        if (entityPosition) {
            for (const item of this.items) {
                const itemPosition = item.getComponent("positionalobject");
                if (itemPosition) {
                    itemPosition.x = entityPosition.x;
                    itemPosition.y = entityPosition.y;
                    itemPosition.updateObjectPosition();
                    engine.needsMapUpdate = true;
                }
            }
        }
    }

    onAddToScene() {
        for (const item of this.items) {
            const object = item.getComponent("positionalobject");
            if (object) {
                if (!object.isVisible()) {
                    object.setVisible();
                    sceneState.scene.add(object.object);
                } else {
                    object.resetColor();
                }
            }
        }
    }
}