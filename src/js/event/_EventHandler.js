import * as THREE from "three";
import sceneState from "../SceneState";
import details from "../ui/Details";
import engine from "../Engine";

export default class EventHandler {
    constructor() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.mouseDown = false;

        window.addEventListener("mousemove", this);
        window.addEventListener("mousedown", this);
        window.addEventListener("mouseup", this);
        window.addEventListener("click", this);
        window.addEventListener("contextmenu", this);
        window.addEventListener("change", this);
        window.addEventListener("keydown", this);

        this.isPlayerTurn = true;
        this.highlightedTiles = [];
    }

    teardown() {
        window.removeEventListener("mousemove", this);
        window.removeEventListener("mousedown", this);
        window.removeEventListener("mouseup", this);
        window.removeEventListener("click", this);
        window.removeEventListener("contextmenu", this);
        window.removeEventListener("change", this);
        window.removeEventListener("keydown", this);

        this.clearHighlights();
    }

    handleEvent(e) {
        switch(e.type) {
            case "mousemove":
                this.onMouseMove(e);
                break;
            case "mousedown":
                this.onMouseDown(e);
                break;
            case "mouseup":
                this.onMouseUp(e);
                break;
            case "click":
                this.onLeftClick(e);
                break;
            case "contextmenu":
                this.onRightClick(e);
                break;
            case "change":
                this.onChange(e);
                break;
            case "keydown":
                this.onKeydown(e);
                break;
        }
    }

    handleInput() {}

    onMouseMove(e) {}

    onMouseDown(e) {
        this.mouseDown = true;
    }

    onMouseUp(e) {
        this.mouseDown = false;
    }

    onLeftClick(e) {}

    onRightClick(e) {}

    onChange(e) {}

    onKeydown(e) {}

    getMouseIntersectingObjects(e) {
        this.mouse.x = (e.clientX / sceneState.canvasDom.offsetWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / sceneState.canvasDom.offsetHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, sceneState.camera);

        return this.raycaster.intersectObject(sceneState.scene, true);
    }

    isHighlighted(tile) {
        for (const highlightedTile of this.highlightedTiles) {
            if (tile === highlightedTile) {
                return true;
            }
        }

        return false;
    }

    clearAndSetHighlights(tiles) {
        this.clearHighlights();
        for (const tile of tiles) {
            const position = tile.getComponent("positionalobject");
            if (position) {
                position.highlight();
                this.highlightedTiles.push(tile);
            }
        }
        engine.needsMapUpdate = true;
    }

    clearAndSetHighlight(tile) {
        this.clearHighlights();
        const position = tile.getComponent("positionalobject");
        if (position) {
            position.highlight();
            this.highlightedTiles.push(tile);
        }

        details.updatePositionDetails(tile);
        engine.needsMapUpdate = true;
    }

    clearHighlights(updatePlayer = false) {
        for (const highlightedTile of this.highlightedTiles) {
            const position = highlightedTile.getComponent("positionalobject");
            if (position) {
                position.removeHighlight();
            }
        }

        this.highlightedTiles = [];

        if (updatePlayer) {
            details.updatePlayerDetails();
        }

        engine.needsMapUpdate = true;
    }
}