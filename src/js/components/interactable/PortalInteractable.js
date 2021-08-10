import Interactable from "./_Interactable";
import Extend from "../../util/Extend";
import engine from "../../Engine";
import entityLoader from "../../entity/EntityLoader";

export default class PortalInteractable extends Interactable {
    constructor(args = {}) {
        super(Extend.extend(args, {type: "portalInteractable"}));
        const hasComponent = args.components && args.components.portalInteractable !== undefined;

        this.map = null;
        this.x = null;
        this.y = null;
        this.z = null;

        if (hasComponent) {
            const portalInteractable = args.components.portalInteractable;
            if (portalInteractable) {
                if (portalInteractable.map !== undefined) {
                    this.map = portalInteractable.map;
                }

                if (portalInteractable.x !== undefined) {
                    this.x = portalInteractable.x;
                }

                if (portalInteractable.y !== undefined) {
                    this.y = portalInteractable.y;
                }

                if (portalInteractable.z !== undefined) {
                    this.z = portalInteractable.z;
                }
            }
        }
    }

    save() {
        if (this.cachedSave) {
            return this.cachedSave;
        }

        let saveJson = {
            "portalInteractable": {}
        };

        if (this.map) {
            saveJson.portalInteractable.map = this.map;
        }

        if (this.x !== null) {
            saveJson.portalInteractable.x = this.x;
        }
        if (this.y !== null) {
            saveJson.portalInteractable.y = this.y;
        }
        if (this.z !== null) {
            saveJson.portalInteractable.z = this.z;
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

            if (this.map.name !== 'town') {
                const town = engine.gameMaps.get("town");
                town.tiles.get(1)[34][36] = entityLoader.createFromTemplate('portal', {components: {positionalobject: {x: 34, y: 36, z: 1}, portalInteractable: {map: engine.gameMap.name, x: playerPosition.x, y: playerPosition.y, z: playerPosition.z}}});
            }
            this.parentEntity.getComponent("positionalobject").teardown();
            engine.gameMap.tiles.get(playerPosition.z)[playerPosition.x][playerPosition.y] = null;

            playerPosition.x = this.x;
            playerPosition.y = this.y;
            playerPosition.z = this.z;
            engine.setMap(engine.gameMaps.get(this.map), this);
        }
    }
}