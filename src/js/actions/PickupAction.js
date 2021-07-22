import Action from "./_Action";
import engine from "../Engine";
import messageConsole from "../ui/MessageConsole";
import UnableToPerformAction from "./UnableToPerformAction";
import sceneState from "../SceneState";

export default class PickupAction extends Action {
    constructor(entity) {
        super(entity);
    }

    perform() {
        const position = this.entity.getComponent("positionalobject");
        const inventory = this.entity.getComponent("inventory");
        for (const item of engine.gameMap.items) {
            const itemPosition = item.getComponent("positionalobject");
            if (position.x === itemPosition.x && position.y === itemPosition.y && position.z === itemPosition.z) {
                if (inventory.items.length < inventory.capacity) {
                    const itemIndex = engine.gameMap.items.indexOf(item);
                    engine.gameMap.items.splice(itemIndex, 1);
                    sceneState.scene.remove(itemPosition.object);

                    inventory.items.push(item);
                    if (this.entity === engine.player) {
                        messageConsole.text("You picked up the " + item.name).build();
                    }
                    return this;
                }
            }
        }

        return new UnableToPerformAction(this.entity, "There is nothing here to pick up.");
    }
}