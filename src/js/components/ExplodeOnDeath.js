import _Component from "./_Component";
import Extend from "../util/Extend";
import engine from "../Engine";

export default class ExplodeOnDeath extends _Component {
    constructor(args = {}) {
        super(Extend.extend(args, {baseType: "explodeOnDeath"}));
        const hasComponent = args.components && args.components.explodeOnDeath !== undefined;

        this.damage = 0;
        this.radius = 0;

        if (hasComponent) {
            const explodeOnDeath = args.components.explodeOnDeath;
            if (explodeOnDeath.damage !== undefined) {
                this.damage = explodeOnDeath.damage;
            }

            if (explodeOnDeath.radius !== undefined) {
                this.radius = explodeOnDeath.radius;
            }
        }
    }

    save() {
        if (this.cachedSave) {
            return this.cachedSave;
        }

        const saveJson = {
            "explodeOnDeath": {
                damage: this.damage,
                radius: this.radius
            }
        };

        this.cachedSave = saveJson;
        return saveJson;
    }

    onEntityDeath() {
        const entity = this.parentEntity;

        const position = entity.getComponent("positionalobject");
        if (position) {
            position.teardown();

            engine.gameMap.removeActor(entity);

            if (this.damage > 0) {
                for (const actor of engine.gameMap.actors) {
                    const actorPosition = actor.getComponent("positionalobject");
                    if (position.horizontalDistance(actorPosition) <= this.radius) {
                        const fighter = actor.getComponent("fighter");
                        if (fighter) {
                            fighter.takeDamage(this.damage - fighter.getBlockedDamage());
                        }
                    }
                }
            }
        }
    }
}