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
        let json = {
            "stairsInteractable": {}
        }

        if (this.map) {
            json.stairsInteractable.map = this.map;
        }

        if (this.x !== null) {
            json.stairsInteractable.x = this.x;
        }
        if (this.y !== null) {
            json.stairsInteractable.y = this.y;
        }
        if (this.z !== null) {
            json.stairsInteractable.z = this.z;
        }

        if (this.generator) {
            json.stairsInteractable.generator = this.generator;
        }

        return json;
    }

    interact() {
        if (this.map) {
            const playerPosition = engine.player.getComponent("positionalobject");
            playerPosition.x = this.x;
            playerPosition.y = this.y;
            playerPosition.z = this.z;
            engine.setMap(engine.gameMaps.get(this.map), this);
        } else if (this.generator) {
            const newMap = engine.mapLoader.loadMap(this.generator);
            this.map = newMap.name;
            this.generator = null;
            engine.setMap(newMap, this);
        }
    }
}