import Consumable from "./_Consumable";
import messageConsole from "../../ui/MessageConsole";
import engine from "../../Engine";
import ItemAction from "../../actions/itemAction/ItemAction";
import NoAction from "../../actions/NoAction";
import Extend from "../../util/Extend";
import AreaRangedAttackHandler from "../../event/selectIndexHandler/AreaRangedAttackHandler";
import UnableToPerformAction from "../../actions/UnableToPerformAction";

export default class AOEDamageConsumable extends Consumable {
    constructor(args = {}) {
        super(Extend.extend(args, {type: "aoeDamageConsumable"}));
        const hasComponent = args.components && args.components.aoeDamageConsumable !== undefined;

        this.damage = 12;
        this.radius = 1;

        if (hasComponent) {
            const aoeDamageConsumable = args.components.aoeDamageConsumable;
            if (aoeDamageConsumable) {
                if (aoeDamageConsumable.damage !== undefined) {
                    this.damage = aoeDamageConsumable.damage
                }

                if (aoeDamageConsumable.radius !== undefined) {
                    this.radius = aoeDamageConsumable.radius
                }
            }
        }
    }

    save() {
        return {
            "aoeDamageConsumable": {
                damage: this.damage,
                radius: this.radius
            }
        }
    }

    getAction() {
        const self = this;
        if (this.isPlayer()) {
            messageConsole.text("Select a target location.", "#3fffff").build();
        }

        engine.setEventHandler(new AreaRangedAttackHandler(function(targetPosition) {
            return new ItemAction(self.getConsumer(), self.getItem(), targetPosition);
        }, self.radius));

        return new NoAction(this.parentEntity);
    }

    /**
     *
     * @param {ItemAction} action
     */
    activate(action) {
        const targetPosition = action.targetPosition;

        if (!engine.gameMap.isPositionVisible(targetPosition)) {
            return new UnableToPerformAction(this.parentEntity, "You cannot target an area that you cannot see.");
        }

        const fovHit = this.targetActors(targetPosition, engine.fov.visibleActors);
        const airFovHit = this.targetActors(targetPosition, engine.airFov.visibleActors);

        if (fovHit || airFovHit) {
            this.consume();
            return this;
        } else {
            return new UnableToPerformAction(this.parentEntity, "There are no targets in range.");
        }
    }

    targetActors(targetPosition, actors) {
        let targetsHit = false;
        for (const actor of actors) {
            const position = actor.getComponent("positionalobject");
            if (position.horizontalDistance(targetPosition) <= this.radius) {
                const fighter = actor.getComponent("fighter");
                if (fighter) {
                    if (this.isPlayer()) {
                        messageConsole.text("The " + actor.name + " is engulfed in a fiery explosion, taking " + this.damage + " damage!").build();
                    }

                    fighter.takeDamage(this.damage);
                    targetsHit = true;
                }
            }
        }

        return targetsHit;
    }
}