import Interactable from "./_Interactable";
import Extend from "../../util/Extend";
import engine from "../../Engine";

export default class StairsInteractable extends Interactable {
    constructor(args = {}) {
        super(Extend.extend(args, {type: "stairsInteractable"}));
        const hasComponent = args.components && args.components.stairsInteractable !== undefined;

        this.map = null;
        this.x = null;
        this.y = null;
        this.z = null;
        this.generator = null;

        if (hasComponent) {
            const stairsInteractable = args.components.stairsInteractable;
            if (stairsInteractable) {
                if (stairsInteractable.map !== undefined) {
                    this.map = stairsInteractable.map;
                }

                if (stairsInteractable.x !== undefined) {
                    this.x = stairsInteractable.x;
                }

                if (stairsInteractable.y !== undefined) {
                    this.y = stairsInteractable.y;
                }

                if (stairsInteractable.z !== undefined) {
                    this.z = stairsInteractable.z;
                }

                if (stairsInteractable.generator !== undefined) {
                    this.generator = stairsInteractable.generator;
                }
            }
        }
    }

    save() {
        if (this.cachedSave) {
            return this.cachedSave;
        }

        let saveJson = {
            "stairsInteractable": {}
        };

        if (this.map) {
            saveJson.stairsInteractable.map = this.map;
        }

        if (this.x !== null) {
            saveJson.stairsInteractable.x = this.x;
        }
        if (this.y !== null) {
            saveJson.stairsInteractable.y = this.y;
        }
        if (this.z !== null) {
            saveJson.stairsInteractable.z = this.z;
        }

        if (this.generator) {
            saveJson.stairsInteractable.generator = this.generator;
        }

        this.cachedSave = saveJson;

        return saveJson;
    }

    setPosition(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.clearSaveCache();
    }

    interact() {
        if (this.map) {
            const playerPosition = engine.player.getComponent("positionalobject");
            playerPosition.x = this.x;
            playerPosition.y = this.y;
            playerPosition.z = this.z;
            engine.setMap(engine.gameMaps.get(this.map), this);
        } else if (this.generator) {
            let args = {};
            if (engine.gameMap.level) {
                args.level = engine.gameMap.level + 1
            }
            const newMap = engine.mapLoader.loadMap(this.generator, args);
            this.map = newMap.name;
            this.generator = null;
            engine.setMap(newMap, this);
        }
    }
}