import UnableToPerformAction from "./actions/UnableToPerformAction";
import sceneState from "./SceneState";
import DefaultPlayerEventHandler from "./event/DefaultPlayerEventHandler";
import AdamMilazzoFov from "./map/fov/AdamMilazzoFov";
import SimpleFov from "./map/fov/SimpleFov";
import details from "./ui/Details";

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

                details.updatePlayerDetails();

                this.handleEnemyTurns();
            }
        }
    }

    handleEnemyTurns() {
        this.eventHandler.isPlayerTurn = false;
        for (const actor of this.gameMap.actors) {
            if (actor !== this.player) {
                const ai = actor.getComponent("ai");
                if (ai) {
                    ai.perform();
                }
            }
        }
        this.eventHandler.isPlayerTurn = true;
    }
}

const engine = new Engine();
export default engine;