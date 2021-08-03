import engine from "../Engine";
import controls from "../controls/Controls";
import TutorialMap from "../map/TutorialMap";
import BasicDungeon from "../map/BasicDungeon";
import _Tile from "../entity/_Tile";
import sceneState from "../SceneState";
import EventHandler from "./_EventHandler";
import EditorEventHandler from "./EditorEventHandler";
import BumpAction from "../actions/actionWithDirection/BumpAction";
import WaitAction from "../actions/WaitAction";
import PickupAction from "../actions/PickupAction";
import inventory from "../ui/Inventory";
import DropAction from "../actions/itemAction/DropAction";
import {Vector2} from "three";
import LookHandler from "./selectIndexHandler/LookHandler";
import characterHealth from "../ui/CharacterHealth";
import characterMana from "../ui/CharacterMana";
import messageConsole from "../ui/MessageConsole";
import details from "../ui/Details";
import PauseMenuEventHandler from "./PauseMenuEventHandler";

export default class DefaultPlayerEventHandler extends EventHandler {
    constructor() {
        super();

        characterHealth.open();
        characterMana.open();
        messageConsole.open();
        details.open();
    }

    teardown() {
        super.teardown();

        characterHealth.close();
        characterMana.close();
        messageConsole.close();
        details.close();
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
            } else if (controls.testPressed("look")) {
                engine.setEventHandler(new LookHandler());
            } else if (controls.testPressed("inventory")) {
                if (inventory.isOpen()) {
                    inventory.close();
                } else {
                    inventory.populateInventory(engine.player);
                    inventory.open();
                }

                this.hideItemTooltip();
            } else if (controls.testPressed("pause")) {
                engine.setEventHandler(new PauseMenuEventHandler());
            } else if (controls.testPressed("quicksave", 1000)) {
                engine.save("quicksave");
            } else if (controls.testPressed("quickload", 1000)) {
                engine.load("quicksave");
            } else if (engine.settings.debugControlsEnabled) {
                if (controls.testPressed("debug")) {
                    engine.gameMap.reveal();
                    engine.needsMapUpdate = true;
                    engine.setEventHandler(new EditorEventHandler());
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
        }

        return action;
    }

    onMouseMove(e) {
        const target = e.target;
        this.mouse.x = (e.clientX / sceneState.canvasDom.offsetWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / sceneState.canvasDom.offsetHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, sceneState.camera);

        const intersects = this.raycaster.intersectObject(sceneState.scene, true);

        let anyFound = false;
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

                    if (!this.isHighlighted(parentEntity)) {
                        this.clearAndSetHighlight(parentEntity);
                    }

                    anyFound = true;
                    break;
                }
            }
        }

        if (!anyFound) {
            this.clearHighlights(true);
        }

        if (this.attemptToDrag) {
            this.dragDistance = Math.max(Math.abs(this.dragStart.x - e.clientX), Math.abs(this.dragStart.y - e.clientY));

            if (this.dragDistance > 10) {
                this.attemptToDrag = false;
                this.startDragging();
            }
        }

        if (this.isDragging) {
            inventory.itemDragDom.style.left = (e.clientX + this.dragOffset.x) + "px";
            inventory.itemDragDom.style.top = (e.clientY + this.dragOffset.y) + "px";
        }

        if (this.attemptToDrag || this.isDragging) {
            this.hoveringOver = null;
        } else {
            if (target.classList.contains("inventory__storage-slot") && target.classList.contains("has-item")) {
                if (target !== this.hoveringOver) {
                    this.hoveringOver = e.target;
                    const details = target.getElementsByClassName("item__details")[0];
                    const clone = details.cloneNode(true);


                    inventory.itemTooltipDom.innerHTML = "";
                    inventory.itemTooltipDom.appendChild(clone);

                    this.updateToolTipSize(e);
                    inventory.itemTooltipDom.classList.add("active");
                } else {
                    this.updateToolTipSize(e);
                }
            } else {
                this.hideItemTooltip();
            }
        }

        engine.needsMapUpdate = true;
    }

    startDragging() {
        this.isDragging = true;

        this.slotDragging.classList.add("dragging");
        inventory.itemDragDom.classList.add("active");
        this.hideItemTooltip();
    }

    updateToolTipSize(e) {
        const tooltipRect = inventory.itemTooltipDom.getBoundingClientRect();
        inventory.itemTooltipDom.style.left = (e.clientX - tooltipRect.width - 25) + "px";
        inventory.itemTooltipDom.style.top = (e.clientY - (tooltipRect.height / 2)) + "px";
    }

    hideItemTooltip() {
        this.hoveringOver = null;
        inventory.itemTooltipDom.classList.remove("active");
    }

    onLeftClick(e) {
        if (this.isDragging) {
            this.isDragging = false;
        } else {
            const target = e.target;
            if (target.classList.contains("inventory__storage-slot") && target.classList.contains("has-item")) {
                const slot = target.getAttribute("data-index");
                const playerInventory = engine.player.getComponent("inventory");
                const item = playerInventory.items[slot];
                const consumable = item.getComponent("consumable");
                if (consumable) {
                    this.hideItemTooltip();
                    if (engine.processAction(consumable.getAction())) {
                        inventory.populateInventory(engine.player);
                    }
                }
            }
        }
    }

    onRightClick(e) {
        if (this.isDragging) {
            this.isDragging = false;
        } else {
            const target = e.target;
            if (target.classList.contains("inventory__storage-slot") && target.classList.contains("has-item")) {
                e.preventDefault();

                const slot = target.getAttribute("data-index");
                const playerInventory = engine.player.getComponent("inventory");

                this.hideItemTooltip();

                if (engine.processAction(new DropAction(engine.player, playerInventory.items[slot]))) {
                    inventory.populateInventory(engine.player);
                }
            }
        }
    }

    onMouseDown(e) {
        const target = e.target;
        if (target.classList.contains("inventory__storage-slot") && target.classList.contains("has-item")) {
            this.slotDragging = target;
            document.body.classList.add("disable-select");

            const targetRect = target.getBoundingClientRect();
            this.dragStart = new Vector2(e.clientX, e.clientY);
            this.attemptToDrag = true;

            this.dragOffset = new Vector2(targetRect.left - e.clientX, targetRect.top - e.clientY);

            const item = target.getElementsByClassName("item")[0];
            const clone = item.cloneNode(true);

            inventory.itemDragDom.innerHTML = "";
            inventory.itemDragDom.appendChild(clone);
            inventory.itemDragDom.style.width = targetRect.width + "px";
            inventory.itemDragDom.style.height = targetRect.height + "px";
            inventory.itemDragDom.style.left = (e.clientX + this.dragOffset.x) + "px";
            inventory.itemDragDom.style.top = (e.clientY + this.dragOffset.y) + "px";
        }
    }

    onMouseUp(e) {
        this.attemptToDrag = false;
        document.body.classList.remove("disable-select");

        if (this.isDragging) {
            this.slotDragging.classList.remove("dragging");
            inventory.itemDragDom.classList.remove("active");

            const target = e.target;
            if (target.classList.contains("inventory__storage-slot") && !target.classList.contains("disabled")) {
                const slot = target.getAttribute("data-index");
                const slotFrom = this.slotDragging.getAttribute("data-index");

                if (slot !== slotFrom) {
                    const playerInventory = engine.player.getComponent("inventory");
                    playerInventory.move(slotFrom, slot);
                    inventory.populateInventory(engine.player);
                }
            } else if (target.tagName === "CANVAS") {
                const slotFrom = this.slotDragging.getAttribute("data-index");
                const playerInventory = engine.player.getComponent("inventory");

                engine.processAction(new DropAction(engine.player, playerInventory.items[slotFrom]));
                inventory.populateInventory(engine.player);
            }
        }
    }
}