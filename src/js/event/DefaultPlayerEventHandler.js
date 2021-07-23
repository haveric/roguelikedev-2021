import engine from "../Engine";
import controls from "../controls/Controls";
import TutorialMap from "../map/TutorialMap";
import BasicDungeon from "../map/BasicDungeon";
import _Tile from "../entity/_Tile";
import sceneState from "../SceneState";
import EventHandler from "./_EventHandler";
import editorControls from "../ui/EditorControls";
import EditorEventHandler from "./EditorEventHandler";
import editorInfo from "../ui/EditorInfo";
import BumpAction from "../actions/actionWithDirection/BumpAction";
import WaitAction from "../actions/WaitAction";
import details from "../ui/Details";
import PickupAction from "../actions/PickupAction";
import inventory from "../ui/Inventory";
import ItemAction from "../actions/itemAction/ItemAction";
import DropAction from "../actions/itemAction/DropAction";

export default class DefaultPlayerEventHandler extends EventHandler {
    constructor() {
        super();

        this.highlightedTile = null;
    }

    teardown() {
        super.teardown();

        this.clearHighlight();
    }

    clearHighlight(updatePlayer = false) {
        if (this.highlightedTile !== null) {
            const object = this.highlightedTile.getComponent("positionalobject");
            if (object) {
                object.removeHighlight();
            }

            this.highlightedTile = null;
            if (updatePlayer) {
                details.updatePlayerDetails();
            }
        }
    }

    handleInput() {
        let action = null;
        if (this.isPlayerTurn) {
            if (controls.testPressed("up")) {
                action = new BumpAction(engine.player, 0, 1);
            } else if (controls.testPressed("down")) {
                action = new BumpAction(engine.player, 0, -1);
            } else if (controls.testPressed("left")) {
                action = new BumpAction(engine.player, -1);
            } else if (controls.testPressed("right")) {
                action = new BumpAction(engine.player, 1);
            } else if (controls.testPressed("nw")) {
                action = new BumpAction(engine.player, -1, 1);
            } else if (controls.testPressed("ne")) {
                action = new BumpAction(engine.player, 1, 1);
            } else if (controls.testPressed("sw")) {
                action = new BumpAction(engine.player, -1, -1);
            } else if (controls.testPressed("se")) {
                action = new BumpAction(engine.player, 1, -1);
            } else if (controls.testPressed("wait")) {
                action = new WaitAction(engine.player);
            } else if (controls.testPressed("get")) {
                action = new PickupAction(engine.player);
            } else if (controls.testPressed("inventory")) {
                if (inventory.isOpen()) {
                    inventory.close();
                } else {
                    inventory.populateInventory(engine.player);
                    inventory.open();
                }
            } else if (controls.testPressed("save", 1000)) {
                engine.gameMap.save("save1");
            } else if (controls.testPressed("load", 1000)) {
                engine.gameMap.load("save1");
            } else if (controls.testPressed("debug")) {
                engine.gameMap.reveal();
                engine.needsMapUpdate = true;
                engine.setEventHandler(new EditorEventHandler());
                editorControls.show();
                editorInfo.show();
            } else if (controls.testPressed("debug2")) {
                engine.gameMap.teardown();
                engine.gameMap = new TutorialMap();
                engine.gameMap.create();
                engine.needsMapUpdate = true;
            } else if (controls.testPressed("reset")) {
                engine.gameMap.teardown();
                engine.gameMap = new BasicDungeon(100, 100);
                engine.gameMap.create();
                engine.needsMapUpdate = true;
            }
        }

        return action;
    }

    onMouseMove(e) {
        this.mouse.x = (e.clientX / sceneState.canvasDom.offsetWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / sceneState.canvasDom.offsetHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, sceneState.camera);

        const intersects = this.raycaster.intersectObject(sceneState.scene, true);

        let anyFound = false;
        for (let i = 0; i < intersects.length; i++) {
            const object = intersects[i].object;
            const parentEntity = object.parentEntity;
            if (parentEntity && parentEntity instanceof _Tile) {
                const parentObject = parentEntity.getComponent("positionalobject");
                if (parentObject) {
                    // Skip invisible items
                    if (parentObject.transparency === 0) {
                        continue;
                    }

                    if (!parentObject.hasObject()) {
                        continue;
                    }

                    if (this.highlightedTile !== parentEntity) {
                        this.clearHighlight();
                        this.highlightedTile = parentEntity;
                        parentObject.highlight();
                        details.updatePositionDetails(parentEntity);
                    }

                    anyFound = true;
                    break;
                }
            }
        }

        if (!anyFound) {
            this.clearHighlight(true);
        }

        engine.needsMapUpdate = true;
    }

    onLeftClick(e) {
        const target = e.target;
        if (target.classList.contains("inventory__storage-slot") && target.classList.contains("has-item")) {
            const slot = target.getAttribute("data-index");
            const playerInventory = engine.player.getComponent("inventory");
            engine.processAction(new ItemAction(engine.player, playerInventory.items[slot]));
            inventory.populateInventory(engine.player);
        }
    }

    onRightClick(e) {
        const target = e.target;
        if (target.classList.contains("inventory__storage-slot") && target.classList.contains("has-item")) {
            e.preventDefault();

            const slot = target.getAttribute("data-index");
            const playerInventory = engine.player.getComponent("inventory");
            engine.processAction(new DropAction(engine.player, playerInventory.items[slot]));
            inventory.populateInventory(engine.player);
        }
    }
}