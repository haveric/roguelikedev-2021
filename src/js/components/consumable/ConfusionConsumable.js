import Consumable from "./_Consumable";
import Extend from "../../util/Extend";
import engine from "../../Engine";
import UnableToPerformAction from "../../actions/UnableToPerformAction";
import messageConsole from "../../ui/MessageConsole";
import componentLoader from "../ComponentLoader";
import SingleRangedAttackHandler from "../../event/selectIndexHandler/SingleRangedAttackHandler";
import ItemAction from "../../actions/itemAction/ItemAction";
import NoAction from "../../actions/NoAction";
import AIConfusedEnemy from "../ai/AIConfusedEnemy";

export default class ConfusionConsumable extends Consumable {
    constructor(args = {}) {
        super(Extend.extend(args, {type: "confusionConsumable"}));
        const hasComponent = args.components && args.components.confusionConsumable !== undefined;

        this.turns = 0;

        if (hasComponent) {
            const confusionConsumable = args.components.confusionConsumable;
            if (confusionConsumable && confusionConsumable.turns !== undefined) {
                this.turns = confusionConsumable.turns;
            }
        }
    }

    save() {
        if (this.cachedSave) {
            return this.cachedSave;
        }

        const saveJson = {
            "confusionConsumable": {
                turns: this.turns
            }
        };

        this.cachedSave = saveJson;
        return saveJson;
    }

    getAction() {
        const self = this;
        if (this.isPlayer()) {
            messageConsole.text("Select a target location.", "#3fffff").build();
        }

        engine.setEventHandler(new SingleRangedAttackHandler(function(targetPosition) {
            return new ItemAction(self.getConsumer(), self.getItem(), targetPosition);
        }));

        return new NoAction(this.parentEntity);
    }

    /**
     *
     * @param {ItemAction} action
     */
    activate(action) {
        const consumer = action.entity;

        const target = action.getTargetActor();
        if (!target) {
            return new UnableToPerformAction(this.parentEntity, "You must select an enemy to target.");
        }

        if (target === consumer) {
            return new UnableToPerformAction(this.parentEntity, "You cannot confuse yourself.");
        }

        if (engine.fov.visibleActors.indexOf(target) === -1 && engine.airFov.visibleActors.indexOf(target) === -1) {
            return new UnableToPerformAction(this.parentEntity, "You cannot target an area that you cannot see.");
        }

        if (this.isPlayer()) {
            messageConsole.text("The eyes of the " + target.name + " look vacant, as it starts to stumble around!", "#3fff3f").build();
        }

        const ai = target.getComponent("ai");
        if (ai) {
            if (ai instanceof AIConfusedEnemy) {
                ai.setTurnsRemaining(this.turns);
            } else {
                const aiType = ai.type;
                const aiArgs = {
                    components: {
                        aiConfusedEnemy: {
                            previousAI: aiType,
                            turnsRemaining: this.turns
                        }
                    }
                };
                target.removeComponent("ai");
                const newAI = componentLoader.create(target, "aiConfusedEnemy", aiArgs);
                target.setComponent(newAI);
            }

            this.consume();
        }

        return this;
    }

    getDescription() {
        return "<span class='item__details-line'>Confuses for: <span style='color: #cf3fff;'>" + this.turns + "</span> turns</span>";
    }
}