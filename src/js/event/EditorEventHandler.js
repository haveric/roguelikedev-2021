import engine from "../Engine";
import controls from "../controls/Controls";
import TutorialMap from "../map/TutorialMap";
import EventHandler from "./_EventHandler";
import editorControls from "../ui/editor/EditorControls";
import DefaultPlayerEventHandler from "./DefaultPlayerEventHandler";
import _Tile from "../entity/_Tile";
import Actor from "../entity/Actor";
import Item from "../entity/Item";
import editorInfo from "../ui/editor/EditorInfo";
import BumpAction from "../actions/actionWithDirection/BumpAction";

export default class EditorEventHandler extends EventHandler {
    constructor() {
        super();
        this.selectedEntity = null;

        editorControls.open();
        editorInfo.open();
    }

    teardown() {
        super.teardown();
        this.clearSelected();

        editorControls.close();
        editorInfo.close();
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
            action = new BumpAction(engine.player, 0, 1);
        } else if (controls.testPressed("editor-down")) {
            action = new BumpAction(engine.player, 0, -1);
        } else if (controls.testPressed("editor-left")) {
            action = new BumpAction(engine.player, -1);
        } else if (controls.testPressed("editor-right")) {
            action = new BumpAction(engine.player, 1);
        } else if (controls.testPressed("debug")) {
            engine.gameMap.reveal();
            engine.needsMapUpdate = true;
            engine.setEventHandler(new DefaultPlayerEventHandler());
            editorControls.close();
            editorInfo.close();
        } else if (controls.testPressed("debug2")) {
            engine.clearMaps();
            engine.setMap(new TutorialMap());
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
                            // Skip invisible items
                            if (parentObject.transparency === 0) {
                                continue;
                            }

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
                    // Skip invisible items
                    if (parentObject.transparency === 0) {
                        continue;
                    }

                    if (!this.isHighlighted(parentEntity)) {
                        this.clearAndSetHighlight(parentEntity);
                    }
                }

                anyFound = true;
                break;
            }
        }

        if (!anyFound) {
            this.clearHighlights(true);
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
                } else if (parentEntity instanceof Actor) {
                    engine.gameMap.removeActor(parentEntity);
                } else if (parentEntity instanceof Item) {
                    engine.gameMap.removeItem(parentEntity)
                }
                parentObject.teardown();

                break;
            }
        }
    }
}