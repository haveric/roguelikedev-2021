import Consumable from "./_Consumable";
import Extend from "../../util/Extend";
import messageConsole from "../../ui/MessageConsole";
import engine from "../../Engine";
import ItemAction from "../../actions/itemAction/ItemAction";
import NoAction from "../../actions/NoAction";
import EmptyTileTargetHandler from "../../event/selectIndexHandler/EmptyTileTargetHandler";
import UnableToPerformAction from "../../actions/UnableToPerformAction";
import entityLoader from "../../entity/EntityLoader";

export default class SummonPortalConsumable extends Consumable {
    constructor(args = {}) {
        super(Extend.extend(args, {type: "summonPortalConsumable"}));
    }

    save() {
        if (this.cachedSave) {
            return this.cachedSave;
        }

        const saveJson = {
            "summonPortalConsumable": {}
        }

        this.cachedSave = saveJson;
        return saveJson;
    }

    getAction() {
        const self = this;

        if (engine.gameMap && engine.gameMap.name === "town") {
            return new UnableToPerformAction(this.parentEntity, "You can't summon a portal in town!");
        }

        if (this.isPlayer()) {
            messageConsole.text("Select a target location.", "#3fffff").build();
        }

        engine.setEventHandler(new EmptyTileTargetHandler(function(targetPosition) {
            return new ItemAction(self.getConsumer(), self.getItem(), targetPosition);
        }));

        return new NoAction(this.parentEntity);
    }

    /**
     *
     * @param {ItemAction} action
     * @param {Vector3} targetPosition
     */
    activate(action, targetPosition) {
        const wallTiles = engine.gameMap.tiles.get(targetPosition.z + 1);
        if (wallTiles) {
            const tilesX = wallTiles[targetPosition.x];
            if (tilesX) {
                const tile = tilesX[targetPosition.y];
                if (tile) {
                    const blocksMovement = tile.getComponent("walkable");
                    if (blocksMovement && blocksMovement.blocksMovement) {
                        return new UnableToPerformAction(this.parentEntity, tile.name + " is in the way.");
                    }
                }
            }
        }

        let hasFloorTile = false;
        const floorTiles = engine.gameMap.tiles.get(targetPosition.z);
        if (floorTiles) {
            const tilesX = floorTiles[targetPosition.x];
            if (tilesX) {
                const tile = tilesX[targetPosition.y];
                if (tile) {
                    const walkable = tile.getComponent("walkable");
                    const position = tile.getComponent("positionalobject");
                    if (position && walkable && walkable.walkable) {
                        if (position.transparency === 1 && position.hasObject()) {
                            hasFloorTile = true;
                        } else {
                            return new UnableToPerformAction(this.parentEntity, "You can't see there!");
                        }
                    }
                }
            }
        }

        if (!hasFloorTile) {
            return new UnableToPerformAction(this.parentEntity, "No floor there to support the portal.");
        }

        const target = action.getTargetActor();
        if (target) {
            return new UnableToPerformAction(this.parentEntity, target.name + " is in the way.");
        }

        engine.gameMap.tiles.get(targetPosition.z + 1)[targetPosition.x][targetPosition.y] = entityLoader.createFromTemplate('portal', {components: {positionalobject: {x: targetPosition.x, y: targetPosition.y, z: targetPosition.z + 1}, portalInteractable: {map: "town", x: 34, y:36, z:1}}});
        const town = engine.gameMaps.get("town");
        town.tiles.get(1)[34][36] = entityLoader.createFromTemplate('portal', {components: {positionalobject: {x: 34, y: 36, z: 1}, portalInteractable: {map: engine.gameMap.name, x: targetPosition.x, y: targetPosition.y, z: targetPosition.z + 1}}});

        this.consume();
    }
}