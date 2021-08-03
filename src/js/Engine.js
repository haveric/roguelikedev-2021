import UnableToPerformAction from "./actions/UnableToPerformAction";
import sceneState from "./SceneState";
import AdamMilazzoFov from "./map/fov/AdamMilazzoFov";
import SimpleFov from "./map/fov/SimpleFov";
import messageConsole from "./ui/MessageConsole";
import NoAction from "./actions/NoAction";
import MainMenuEventHandler from "./event/MainMenuEventHandler";
import Settings from "./settings/Settings";
import saveManager from "./SaveManager";
import entityLoader from "./entity/EntityLoader";
import GameMap from "./map/GameMap";

class Engine {
    constructor() {
        this.eventHandler = new MainMenuEventHandler();
        this.settings = new Settings();
        this.player = null;
        this.gameMap = null;
        this.gameMaps = new Map();
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

                saveManager.autosave();
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

    setMap(map) {
        if (this.gameMap === map) {
            return;
        }

        if (this.gameMap) {
            this.gameMap.teardown();
        }
        this.addMap(map);

        this.gameMap = map;
        this.gameMap.create();
        this.needsMapUpdate = true;
    }

    addMap(map) {
        if (!this.gameMaps.has(map.name)) {
            this.gameMaps.set(map.name, map);
        }
    }

    clearMaps() {
        this.gameMaps = new Map();
    }

    save(name) {
        const maps = [];
        for (const map of this.gameMaps.values()) {
            maps.push(map.save());
        }
        let saveJson = {
            "name": name,
            "date": new Date(),
            "currentMap": this.gameMap.name,
            "maps": maps
        }

        localStorage.setItem(name, JSON.stringify(saveJson));
    }

    load(name) {
        this.clearMaps();
        const loadData = localStorage.getItem(name);
        if (loadData) {
            const json = JSON.parse(loadData);
            const currentMap = json.currentMap;
            for (const map of json.maps) {
                const newMap = new GameMap(map.name, map.width, map.height);
                newMap.load(map);
                this.addMap(newMap);

                if (map.name === currentMap) {
                    this.setMap(newMap);
                }
            }
        }

        for (const actor of this.gameMap.actors) {
            if (actor.name === 'Player') {
                engine.player = actor;
                break;
            }
        }

        const positionalObject = engine.player.getComponent("positionalobject");
        positionalObject.setVisible();
        sceneState.updateCameraPosition(engine.player);

        this.gameMap.revealPreviouslyExplored();
        this.gameMap.updatePlayerUI();
    }
}

const engine = new Engine();
export default engine;