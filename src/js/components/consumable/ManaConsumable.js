import Consumable from "./_Consumable";
import UnableToPerformAction from "../../actions/UnableToPerformAction";
import messageConsole from "../../ui/MessageConsole";

export default class ManaConsumable extends Consumable {
    constructor(args = {}) {
        super(args, "manaConsumable");
        const hasComponent = args.components && args.components.manaConsumable !== undefined;

        this.amount = 0;

        if (hasComponent) {
            const manaConsumable = args.components.manaConsumable;
            if (manaConsumable && manaConsumable.amount !== undefined) {
                this.amount = manaConsumable.amount;
            }
        }
    }

    save() {
        if (this.cachedSave) {
            return this.cachedSave;
        }

        const saveJson = {
            "manaConsumable": {
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
            const amountRecovered = fighter.recoverMana(this.amount);

            if (amountRecovered > 0) {
                this.consume();
                if (this.isPlayer()) {
                    messageConsole.text("You consume the " + this.parentEntity.name + ", and recover " + amountRecovered + " mana!").build();
                }
                return this;
            } else {
                return new UnableToPerformAction(action.entity, "Your mana is already full");
            }
        }
    }

    getDescription() {
        return "<span class='item__details-line'>Recovers <span style='color: #c00;'>" + this.amount + "</span> mana</span>";
    }
}