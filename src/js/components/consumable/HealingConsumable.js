import Consumable from "./_Consumable";
import Extend from "../../util/Extend";
import UnableToPerformAction from "../../actions/UnableToPerformAction";
import messageConsole from "../../ui/MessageConsole";
import engine from "../../Engine";

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
        if (this.cachedSave) {
            return this.cachedSave;
        }

        const saveJson = {
            "healingConsumable": {
                amount: this.amount
            }
        };

        this.cachedSave = saveJson;
        return saveJson;
    }

    /**
     *
     * @param {ItemAction} action
     */
    activate(action) {
        const consumer = action.entity;
        const fighter = consumer.getComponent("fighter");
        if (fighter) {
            const amountHealed = fighter.heal(this.getModifiedAmount());

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

    getModifiedAmount() {
        let amount = this.amount;
        let healingBonus = 0;
        let consumer = this.getConsumer();
        if (!consumer) {
            consumer = engine.player;
        }

        const fighter = consumer.getComponent("fighter");
        if (fighter) {
            healingBonus = fighter.healingBonus;
        }

        return amount + healingBonus;
    }

    getDescription() {
        return "<span class='item__details-line'>Recovers <span style='color: #c00;'>" + this.getModifiedAmount() + "</span> health</span>";
    }
}