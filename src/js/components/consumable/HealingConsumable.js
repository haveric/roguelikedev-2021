import Consumable from "./_Consumable";
import Extend from "../../util/Extend";
import UnableToPerformAction from "../../actions/UnableToPerformAction";
import messageConsole from "../../ui/MessageConsole";

export default class HealingConsumable extends Consumable {
    constructor(args = {}) {
        super(Extend.extend(args, {type: "healingConsumable"}));
        const hasComponent = args.components && args.components.healingConsumable !== undefined;

        this.amount = 0;

        if (hasComponent) {
            const healingConsumable = args.components.healingConsumable;
            if (healingConsumable && healingConsumable.amount !== undefined) {
                this.amount = healingConsumable.amount
            }
        }
    }

    save() {
        return {
            "healingConsumable": {
                amount: this.amount
            }
        }
    }

    /**
     *
     * @param {ItemAction} action
     */
    activate(action) {
        const consumer = action.entity;
        const fighter = consumer.getComponent("fighter");
        if (fighter) {
            const amountHealed = fighter.heal(this.amount);

            if (amountHealed > 0) {
                this.consume();
                if (this.isPlayer()) {
                    messageConsole.text("You consume the " + this.parentEntity.name + ", and recover " + amountHealed + " HP!").build();
                }
                return this;
            } else {
                return new UnableToPerformAction(action.entity, "Your health is already full");
            }
        }
    }

    getDescription() {
        return "<span class='item__details-line'>Recovers <span style='color: #c00;'>" + this.amount + "</span> health</span>";
    }
}