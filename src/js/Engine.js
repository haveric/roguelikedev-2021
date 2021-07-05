import EventHandler from "./event/EventHandler";
import UnableToPerformAction from "./actions/UnableToPerformAction";
import sceneState from "./SceneState";

class Engine {
    constructor() {
        this.eventHandler = new EventHandler();
        this.player = null;
        this.gameMap = null;
        this.needsMapUpdate = false;
    }

    handleEvents() {
        const action = this.eventHandler.handleInput();
        if (action != null) {
            const performedAction = action.perform(this.player);
            if (!(performedAction instanceof UnableToPerformAction)) {
                sceneState.updateCameraPosition(engine.player);
                engine.needsMapUpdate = true;
            }
        }
    }
}

const engine = new Engine();
export default engine;