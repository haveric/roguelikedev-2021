import Consumable from "./_Consumable";
import Extend from "../../util/Extend";
import engine from "../../Engine";
import {MathUtils} from "three";
import messageConsole from "../../ui/MessageConsole";
import UnableToPerformAction from "../../actions/UnableToPerformAction";

export default class DamageNearestConsumable extends Consumable {
    constructor(args = {}) {
        super(Extend.extend(args, {type: "damageNearestConsumable"}));
        const hasComponent = args.components && args.components.damageNearestConsumable !== undefined;

        this.damage = 20;
        this.maxRange = 5;

        if (hasComponent) {
            const damageNearestConsumable = args.components.damageNearestConsumable;
            if (damageNearestConsumable) {
                if (damageNearestConsumable.damage !== undefined) {
                    this.damage = damageNearestConsumable.damage;
                }

                if (damageNearestConsumable.maxRange !== undefined) {
                    this.maxRange = damageNearestConsumable.maxRange;
                }
            }
        }
    }

    save() {
        return {
            "damageNearestConsumable": {
                damage: this.damage,
                maxRange: this.maxRange
            }
        }
    }

    /**
     *
     * @param {ItemAction} action
     */
    activate(action) {
        const consumer = action.entity;
        let target = this.getClosestActor(consumer);

        if (target) {
            if (this.isPlayer()) {
                messageConsole.text(target.name + " is struck for " + this.damage + " damage!").build();
            }
            target.getComponent("fighter").takeDamage(this.damage);

            this.consume();
            return this;
        } else {
            return new UnableToPerformAction(action.entity, "No enemy is close enough to strike.");
        }
    }

    getClosestActor(consumer) {
        let closestEnemies = [];
        let closestDistance = null;
        const airActors = engine.airFov.visibleActors;
        const actors = engine.fov.visibleActors;

        const consumerPosition = consumer.getComponent("positionalobject");
        const consumerFaction = consumer.getComponent("faction");

        if (consumerPosition && consumerFaction) {
            for (const actor of airActors) {
                if (actor.isAlive()) {
                    if (consumerFaction.isEnemyOf(actor.getComponent("faction"))) {
                        const position = actor.getComponent("positionalobject");
                        if (position) {
                            let distance = consumerPosition.distance(position);
                            if (closestDistance === null || distance < closestDistance) {
                                closestEnemies = [];
                                closestEnemies.push(actor);
                                closestDistance = distance;
                            } else if (distance === closestDistance) {
                                closestEnemies.push(actor);
                            }
                        }
                    }
                }
            }

            for (const actor of actors) {
                if (actor.isAlive()) {
                    if (consumerFaction.isEnemyOf(actor.getComponent("faction"))) {
                        const position = actor.getComponent("positionalobject");
                        if (position) {
                            let distance = consumerPosition.distance(position);
                            if (closestDistance === null || distance < closestDistance) {
                                closestEnemies = [];
                                closestEnemies.push(actor);
                                closestDistance = distance;
                            } else if (distance === closestDistance) {
                                closestEnemies.push(actor);
                            }
                        }
                    }
                }
            }
        }

        let closestEnemy;
        if (closestEnemies.length === 1) {
            closestEnemy = closestEnemies[0];
        } else if (closestEnemies.length > 1) {
            const index = MathUtils.randInt(0, closestEnemies.length - 1);
            closestEnemy = closestEnemies[index];
        }

        return closestEnemy;
    }
}