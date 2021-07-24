import SelectIndexHandler from "./_SelectIndexHandler";
import engine from "../../Engine";
import sceneState from "../../SceneState";
import details from "../../ui/Details";

export default class AreaRangedAttackHandler extends SelectIndexHandler {
    constructor(callback, radius) {
        super();

        this.callback = callback;
        this.radius = radius;
    }

    selectIndex(moveCamera = true) {
        let centerIsObscured = true;
        let centerTile = null;
        let visibleTiles = [];
        const tiles = engine.gameMap.tiles.get(this.position.z);
        if (tiles) {
            const left = Math.max(0, this.position.x - this.radius);
            const right = Math.min(engine.gameMap.width, this.position.x + this.radius + 1);
            const top = Math.max(0, this.position.y - this.radius);
            const bottom = Math.min(engine.gameMap.height, this.position.y + this.radius + 1);

            for (let i = left; i < right; i++) {
                const tilesX = tiles[i];
                if (tilesX) {
                    for (let j = top; j < bottom; j++) {
                        const tile = tilesX[j];

                        const position = tile.getComponent("positionalobject");
                        if (position) {
                            // Skip invisible/unseen items
                            if (position.transparency === 1 && position.hasObject()) {
                                visibleTiles.push(tile);
                            }

                            if (i === this.position.x && j === this.position.y) {
                                centerTile = tile;

                                if (position.transparency === 1 && position.hasObject()) {
                                    centerIsObscured = false;
                                }
                            }
                        }
                    }
                }
            }
        }

        if (centerTile) {
            if (moveCamera) {
                sceneState.updateCameraPosition(engine.player, centerTile);
            }

            if (centerIsObscured) {
                details.updatePositionOnly(centerTile);
            } else {
                details.updatePositionDetails(centerTile);
            }
        }

        if (visibleTiles.length > 0) {
            this.clearAndSetHighlights(visibleTiles);
        } else {
            this.clearHighlights(true);
        }
    }

    confirmIndex() {
        engine.processAction(this.callback(this.position));
        this.exit();
    }
}