import UnableToPerformAction from "./actions/UnableToPerformAction";
import sceneState from "./SceneState";
import DefaultPlayerEventHandler from "./event/DefaultPlayerEventHandler";
import AdamMilazzoFov from "./map/fov/AdamMilazzoFov";
import SimpleFov from "./map/fov/SimpleFov";

class Engine {
    constructor() {
        this.eventHandler = new DefaultPlayerEventHandler();
        this.player = null;
        this.gameMap = null;
        this.needsMapUpdate = false;
        this.fov = new AdamMilazzoFov();
        this.airFov = new SimpleFov();
    }

    setEventHandler(eventHandler) {
        if (this.eventHandler) {
            this.eventHandler.teardown();
        }

        this.eventHandler = eventHandler;
    }

    handleEvents() {
        const action = this.eventHandler.handleInput();
        if (action != null) {
            const performedAction = action.perform(this.player);
            if (!(performedAction instanceof UnableToPerformAction)) {
                sceneState.updateCameraPosition(engine.player);
                engine.needsMapUpdate = true;

                this.handleEnemyTurns();
            }
        }
    }

    handleEnemyTurns() {
        for (const actor of this.gameMap.actors) {
            if (actor !== this.player) {
                console.log("The " + actor.name + " wonders when it will get to take a real turn.");
            }
        }
    }
}

const engine = new Engine();
export default engine;