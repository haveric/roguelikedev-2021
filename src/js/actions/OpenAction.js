import UnableToPerformAction from "./UnableToPerformAction";
import ActionWithDirection from "./_ActionWithDirection";
import engine from "../Engine";
import MapLayer from "../map/MapLayer";

export default class OpenAction extends ActionWithDirection {
    constructor(dx, dy, dz) {
        super(dx, dy, dz);
    }

    perform(entity) {
        const position = entity.getComponent("positionalobject");
        if (!position) {
            return new UnableToPerformAction("Entity doesn't have a position.");
        }

        const destX = position.x + this.dx;
        const destY = position.y + this.dy;

        const gameMap = engine.gameMap;
        if (!gameMap.isInBounds(destX, destY)) {
            return new UnableToPerformAction("Location is outside the map!");
        }

        const wallTile = gameMap.tiles.get(MapLayer.Wall)[destX][destY];
        if (wallTile) {
            const openable = wallTile.getComponent("openable");
            if (openable) {
                if (openable.open()) {
                    return this;
                } else {
                    return new UnableToPerformAction("That cannot be opened.");
                }
            }
        }

        return new UnableToPerformAction("There's nothing to open there!");
    }
}