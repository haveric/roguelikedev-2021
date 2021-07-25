import UnableToPerformAction from "./actions/UnableToPerformAction";
import sceneState from "./SceneState";
import DefaultPlayerEventHandler from "./event/DefaultPlayerEventHandler";
import AdamMilazzoFov from "./map/fov/AdamMilazzoFov";
import SimpleFov from "./map/fov/SimpleFov";
import messageConsole from "./ui/MessageConsole";
import NoAction from "./actions/NoAction";

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
        this.processAction(this.eventHandler.handleInput());
    }

    processAction(action) {
        if (action != null && this.eventHandler.isPlayerTurn) {
            const performedAction = action.perform();
            if (performedAction instanceof NoAction) {
                return false;
            }

            if (performedAction instanceof UnableToPerformAction) {
                if (performedAction.reason) {
                    messageConsole.text(performedAction.reason).build();
                }
                return false;
            } else {
                sceneState.updateCameraPosition(engine.player);

                engine.gameMap.updatePlayerUI();
                engine.needsMapUpdate = true;

                this.handleEnemyTurns();

                return true;
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