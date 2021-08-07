import AI from "./_AI";
import Extend from "../../util/Extend";
import WanderAction from "../../actions/WanderAction";
import componentLoader from "../ComponentLoader";

export default class AIConfusedEnemy extends AI {
    constructor(args = {}) {
        super(Extend.extend(args, {type: "aiConfusedEnemy"}));
        const hasComponent = args.components && args.components.aiConfusedEnemy !== undefined;

        this.previousAI = "";
        this.turnsRemaining = 10;

        if (hasComponent) {
            const aiConfusedEnemy = args.components.aiConfusedEnemy;
            if (aiConfusedEnemy) {
                if (aiConfusedEnemy.previousAI) {
                    this.previousAI = aiConfusedEnemy.previousAI;
                }

                if (aiConfusedEnemy.turnsRemaining !== undefined) {
                    this.turnsRemaining = aiConfusedEnemy.turnsRemaining;
                }
            }
        }
    }

    save() {
        if (this.cachedSave) {
            return this.cachedSave;
        }

        const saveJson = {
            "aiConfusedEnemy": {
                "previousAI": this.previousAI,
                "turnsRemaining": this.turnsRemaining
            }
        };

        this.cachedSave = saveJson;
        return saveJson;
    }

    setTurnsRemaining(turns) {
        if (turns > this.turnsRemaining) {
            this.turnsRemaining = turns;
            this.clearSaveCache();
        }
    }

    perform() {
        if (this.turnsRemaining <= 0) {
            this.parentEntity.removeComponent("ai");
            const newAI = componentLoader.create(this.parentEntity, this.previousAI);
            this.parentEntity.setComponent(newAI);
        } else {
            this.setTurnsRemaining(this.turnsRemaining - 1);

            return new WanderAction(this.parentEntity).perform();
        }
    }
}