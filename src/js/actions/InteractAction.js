import Action from "./_Action";
import UnableToPerformAction from "./UnableToPerformAction";
import engine from "../Engine";
import NoAction from "./NoAction";

export default class InteractAction extends Action {
    constructor(entity) {
        super(entity);
    }

    perform() {
        const position = this.entity.getComponent("positionalobject");
        if (!position) {
            return new UnableToPerformAction(this.entity, "Entity doesn't have a position.");
        }

        const gameMap = engine.gameMap;
        const wallTile = gameMap.tiles.get(position.z)[position.x][position.y];
        if (wallTile) {
            const wallInteractable = wallTile.getComponent("interactable");
            if (wallInteractable) {
                wallInteractable.interact();
                return new NoAction(this.entity);
            }
        }

        const floorTile = gameMap.tiles.get(position.z - 1)[position.x][position.y];
        if (floorTile) {
            const floorInteractable = floorTile.getComponent("interactable");
            if (floorInteractable) {
                floorInteractable.interact();
                return new NoAction(this.entity);
            }
        }

        return new UnableToPerformAction(this.entity, "There is nothing to interact with here.");
    }
}