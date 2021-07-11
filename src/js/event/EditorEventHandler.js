import engine from "../Engine";
import controls from "../controls/Controls";
import TutorialMap from "../map/TutorialMap";
import EventHandler from "./_EventHandler";
import editorControls from "../ui/EditorControls";
import DefaultPlayerEventHandler from "./DefaultPlayerEventHandler";
import _Tile from "../entity/_Tile";
import Character from "../entity/Character";
import Item from "../entity/Item";
import editorInfo from "../ui/EditorInfo";
import BumpAction from "../actions/BumpAction";

export default class EditorEventHandler extends EventHandler {
    constructor() {
        super();

        this.highlightedTile = null;
        this.selectedEntity = null;
    }

    teardown() {
        super.teardown();

        this.clearHighlight();
        this.clearSelected();
    }

    clearHighlight() {
        if (this.highlightedTile !== null) {
            // Leave the highlight on selected tiles
            if (this.highlightedTile === this.selectedEntity) {
                return;
            }
            const object = this.highlightedTile.getComponent("positionalobject");
            if (object) {
                object.removeHighlight();
            }
        }
    }

    clearSelected() {
        if (this.selectedEntity !== null) {
            const object = this.selectedEntity.getComponent("positionalobject");
            if (object) {
                object.removeHighlight();
            }
        }
    }

    handleInput() {
        let action = null;
        if (controls.testPressed("editor-up")) {
            action = new BumpAction(0, 1);
        } else if (controls.testPressed("editor-down")) {
            action = new BumpAction(0, -1);
        } else if (controls.testPressed("editor-left")) {
            action = new BumpAction(-1);
        } else if (controls.testPressed("editor-right")) {
            action = new BumpAction(1);
        } else if (controls.testPressed("save", 1000)) {
            engine.gameMap.save("debug1");
        } else if (controls.testPressed("load", 1000)) {
            engine.gameMap.load("debug1");
        } else if (controls.testPressed("debug")) {
            engine.gameMap.reveal();
            engine.needsMapUpdate = true;
            engine.setEventHandler(new DefaultPlayerEventHandler());
            editorControls.hide();
            editorInfo.hide();
        } else if (controls.testPressed("debug2")) {
            engine.gameMap.teardown();
            engine.gameMap = new TutorialMap();
            engine.gameMap.create();
            engine.needsMapUpdate = true;
        }

        return action;
    }

    onLeftClick(e) {
        const target = e.target;
        if (target.tagName === "CANVAS") {
            if (editorControls.activeAction === 'select') {
                const intersects = this.getMouseIntersectingObjects(e);
                let anyFound = false;
                for (let i = 0; i < intersects.length; i++) {
                    const object = intersects[i].object;
                    const parentEntity = object.parentEntity;
                    if (parentEntity) {
                        const parentObject = parentEntity.getComponent("positionalobject");
                        if (parentObject) {
                            this.clearSelected();
                            this.selectedEntity = parentEntity;
                            editorInfo.setDataForEntity(this.selectedEntity);
                            parentObject.highlight();
                        }

                        anyFound = true;
                        break;
                    }
                }

                if (!anyFound) {
                    this.clearSelected();
                }
            } else if (editorControls.activeAction === 'delete') {
                this.removeEntityFromMouseEvent(e);
            }
        }

        engine.needsMapUpdate = true;
    }

    onMouseMove(e) {
        const intersects = this.getMouseIntersectingObjects(e);

        let anyFound = false;
        for (let i = 0; i < intersects.length; i++) {
            const object = intersects[i].object;
            const parentEntity = object.parentEntity;
            if (parentEntity) {
                const parentObject = parentEntity.getComponent("positionalobject");
                if (parentObject && !parentObject.highlighted) {
                    this.clearHighlight();
                    this.highlightedTile = parentEntity;
                    parentObject.highlight();
                }

                anyFound = true;
                break;
            }
        }

        if (!anyFound) {
            this.clearHighlight();
        }

        if (this.mouseDown && editorControls.activeAction === 'delete') {
            this.removeEntityFromMouseEvent(e);
        }

        engine.needsMapUpdate = true;
    }

    removeEntityFromMouseEvent(e) {
        const intersects = this.getMouseIntersectingObjects(e);

        for (let i = 0; i < intersects.length; i++) {
            const object = intersects[i].object;
            const parentEntity = object.parentEntity;
            if (parentEntity) {
                const parentObject = parentEntity.getComponent("positionalobject");

                if (parentEntity instanceof _Tile) {
                    engine.gameMap.tiles.get(parentObject.z)[parentObject.x][parentObject.y] = null;
                } else if (parentEntity instanceof Character) {
                    const index = engine.gameMap.actors.indexOf(parentEntity);
                    if (index > -1) {
                        engine.gameMap.actors.splice(index, 1);
                    }
                } else if (parentEntity instanceof Item) {
                    const index = engine.gameMap.items.indexOf(parentEntity);
                    if (index > -1) {
                        engine.gameMap.items.splice(index, 1);
                    }
                }
                parentObject.teardown();

                break;
            }
        }
    }
}