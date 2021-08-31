import UnableToPerformAction from "./actions/UnableToPerformAction";
import sceneState from "./SceneState";
import AdamMilazzoFov from "./map/fov/AdamMilazzoFov";
import SimpleFov from "./map/fov/SimpleFov";
import messageConsole from "./ui/MessageConsole";
import NoAction from "./actions/NoAction";
import MainMenuEventHandler from "./event/MainMenuEventHandler";
import Settings from "./settings/Settings";
import saveManager from "./SaveManager";
import GameMap from "./map/GameMap";
import MapLoader from "./map/MapLoader";

class Engine {
    constructor() {
        this.eventHandler = new MainMenuEventHandler();
        this.settings = new Settings();
        this.player = null;
        this.gameMap = null;
        this.gameMaps = new Map();
        this.mapLoader = new MapLoader();
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
        if (action && this.eventHandler.isPlayerTurn) {
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

    setMap(map, stairsInteractable) {
        if (this.gameMap === map) {
            return;
        }

        let previousMapName = null;
        if (this.gameMap) {
            previousMapName = this.gameMap.name;
            this.gameMap.teardown();
            this.gameMap.removeActor(this.player);
            this.gameMap.save();
        }

        this.gameMap = map;
        this.addMap(map, previousMapName, stairsInteractable);
        map.save();
        if (this.gameMap.actors.indexOf(this.player) === -1) {
            this.gameMap.actors.push(this.player);
        }

        const positionalObject = this.player.getComponent("positionalobject");
        positionalObject.setVisible();
        sceneState.updateCameraPosition(this.player);
        this.gameMap.revealPreviouslyExplored();
        this.gameMap.updatePlayerUI();
        this.needsMapUpdate = true;
    }

    addMap(map, previousMapName, stairsInteractable) {
        if (!this.gameMaps.has(map.name)) {
            this.gameMaps.set(map.name, map);
            map.create(previousMapName, stairsInteractable);
        }
    }

    clearMaps() {
        this.player = null;
        this.gameMaps = new Map();
    }

    clearAllButTownMaps() {
        this.player = null;
        const town = this.gameMaps.get("town");
        this.gameMaps = new Map();
        this.gameMaps.set("town", town);
    }

    save(name) {
        const maps = [];
        for (const map of this.gameMaps.values()) {
            maps.push(map.save());
        }

        const saveJson = {
            "name": name,
            "date": new Date(),
            "currentMap": this.gameMap.name,
            "maps": maps
        };

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

                if (newMap.name === currentMap) {
                    for (const actor of newMap.actors) {
                        if (actor.name === "Player") {
                            this.player = actor;
                            break;
                        }
                    }

                    this.setMap(newMap);
                }
            }
        }
    }
}

const engine = new Engine();
export default engine;