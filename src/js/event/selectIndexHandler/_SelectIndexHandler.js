import EventHandler from "../_EventHandler";
import engine from "../../Engine";
import {Vector3} from "three";
import controls from "../../controls/Controls";
import DefaultPlayerEventHandler from "../DefaultPlayerEventHandler";
import details from "../../ui/Details";
import sceneState from "../../SceneState";
import _Tile from "../../entity/_Tile";

export default class SelectIndexHandler extends EventHandler {
    constructor() {
        super();

        this.resetPosition();
        this.initted = false;
    }

    init() {
        if (!this.initted) {
            this.selectIndex();
            this.initted = true;
        }
    }

    resetPosition() {
        this.player = engine.player;
        const position = this.player.getComponent("positionalobject");
        this.position = new Vector3(position.x, position.y, position.z - 1);
    }

    exit() {
        sceneState.updateCameraPosition(engine.player);
        engine.setEventHandler(new DefaultPlayerEventHandler());
    }

    handleInput() {
        this.init();

        if (controls.testPressed("cancel")) {
            this.exit();
        } else if (controls.testPressed("confirm")) {
            this.confirmIndex();
        } else if (controls.testPressed("reset") || controls.testPressed("wait")) {
            this.resetPosition();
        } else {
            let modifier = 1;
            if (controls.isPressed("modifier-speed1")) {
                modifier *= 5;
            }

            if (controls.isPressed("modifier-speed2")) {
                modifier *= 10;
            }

            if (controls.isPressed("modifier-speed3")) {
                modifier *= 20;
            }

            let dx = 0;
            let dy = 0;
            if (controls.testPressed("up")) {
                dy = 1;
            } else if (controls.testPressed("down")) {
                dy = -1;
            } else if (controls.testPressed("left")) {
                dx = -1;
            } else if (controls.testPressed("right")) {
                dx = 1;
            } else if (controls.testPressed("nw")) {
                dx = -1;
                dy = 1;
            } else if (controls.testPressed("ne")) {
                dx = 1;
                dy = 1;
            } else if (controls.testPressed("sw")) {
                dx = -1;
                dy = -1;
            } else if (controls.testPressed("se")) {
                dx = 1;
                dy = -1;
            }

            if (dx !== 0 || dy !== 0) {
                let x = this.position.x + (dx * modifier);
                let y = this.position.y + (dy * modifier);

                this.position.x = Math.max(0, Math.min(x, engine.gameMap.width - 1));
                this.position.y = Math.max(0, Math.min(y, engine.gameMap.height - 1));
                this.selectIndex();
            }
        }
    }

    selectIndex(moveCamera = true) {
        let obscuredTile = null;
        let visibleTile = null;
        const tiles = engine.gameMap.tiles.get(this.position.z);
        if (tiles) {
            const tilesX = tiles[this.position.x];
            if (tilesX) {
                const tile = tilesX[this.position.y];

                const position = tile.getComponent("positionalobject");
                if (position) {
                    // Skip invisible/unseen items
                    if (position.transparency === 1 && position.hasObject()) {
                        if (!this.isHighlighted(tile)) {
                            visibleTile = tile;
                        }
                    } else {
                        obscuredTile = tile;
                    }
                }
            }
        }

        if (obscuredTile) {
            this.clearHighlights(false);
            if (moveCamera) {
                sceneState.updateCameraPosition(engine.player, obscuredTile);
            }
            details.updatePositionOnly(obscuredTile);
        } else if (visibleTile) {
            if (moveCamera) {
                sceneState.updateCameraPosition(engine.player, visibleTile);
            }
            this.clearAndSetHighlight(visibleTile);
        } else {
            this.clearHighlights(true);
        }
    }

    confirmIndex() {
        console.error("Not Implemented");
    }

    onMouseMove(e) {
        this.mouse.x = (e.clientX / sceneState.canvasDom.offsetWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / sceneState.canvasDom.offsetHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, sceneState.camera);

        const intersects = this.raycaster.intersectObject(sceneState.scene, true);

        for (let i = 0; i < intersects.length; i++) {
            const object = intersects[i].object;
            const parentEntity = object.parentEntity;
            if (parentEntity && parentEntity instanceof _Tile) {
                const parentPosition = parentEntity.getComponent("positionalobject");
                if (parentPosition) {
                    // Skip invisible/unseen items
                    if (parentPosition.transparency === 0 || !parentPosition.hasObject()) {
                        continue;
                    }

                    if (this.position.x !== parentPosition.x || this.position.y !== parentPosition.y) {
                        this.position.x = parentPosition.x;
                        this.position.y = parentPosition.y;

                        this.selectIndex(false);
                        engine.needsMapUpdate = true;
                    }

                    break;
                }
            }
        }
    }

    onLeftClick(e) {
        this.confirmIndex();
    }
}