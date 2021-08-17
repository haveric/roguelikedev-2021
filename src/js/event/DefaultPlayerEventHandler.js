import engine from "../Engine";
import controls from "../controls/Controls";
import TutorialMap from "../map/TutorialMap";
import BasicDungeon from "../map/BasicDungeon";
import Tile from "../entity/Tile";
import sceneState from "../SceneState";
import EventHandler from "./_EventHandler";
import EditorEventHandler from "./EditorEventHandler";
import BumpAction from "../actions/actionWithDirection/BumpAction";
import WaitAction from "../actions/WaitAction";
import PickupAction from "../actions/PickupAction";
import inventory from "../ui/Inventory";
import {Vector2} from "three";
import LookHandler from "./selectIndexHandler/LookHandler";
import characterHealth from "../ui/CharacterHealth";
import characterMana from "../ui/CharacterMana";
import messageConsole from "../ui/MessageConsole";
import details from "../ui/Details";
import PauseMenuEventHandler from "./PauseMenuEventHandler";
import InteractAction from "../actions/InteractAction";
import character from "../ui/Character";
import bottomContainer from "../ui/BottomContainer";
import DropFromEquipmentAction from "../actions/itemAction/DropFromEquipmentAction";

export default class DefaultPlayerEventHandler extends EventHandler {
    constructor() {
        super();

        bottomContainer.open();
        characterHealth.open();
        characterMana.open();
        messageConsole.open();
        details.open();
    }

    teardown() {
        super.teardown();

        bottomContainer.close();
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
            } else if (controls.testPressed("interact")) {
                action = new InteractAction(engine.player);
            } else if (controls.testPressed("look")) {
                engine.setEventHandler(new LookHandler());
            } else if (controls.testPressed("inventory")) {
                inventory.toggle();

                this.hideItemTooltip();
            } else if (controls.testPressed("character")) {
                character.toggle();
            } else if (controls.testPressed("closeall")) {
                if (inventory.isOpen()) {
                    inventory.close();
                }

                if (character.isOpen()) {
                    character.close();
                }
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
                    engine.clearMaps();
                    engine.setMap(new TutorialMap());
                } else if (controls.testPressed("reset")) {
                    engine.clearMaps();
                    engine.setMap(new BasicDungeon(100, 100));
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
            if (parentEntity && parentEntity instanceof Tile) {
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
            const isSlot = target.classList.contains("slot");
            if (isSlot && target.classList.contains("has-item")) {
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
            const classList = target.classList;
            if (classList.contains("has-item")) {
                const sourceSlot = target.getAttribute("data-index");
                let sourceItem;
                if (classList.contains("inventory__storage-slot")) {
                    const sourceStorage = target.parentNode.getAttribute("data-index");
                    const sourceStorageItem = inventory.openStorages[sourceStorage];
                    const sourceStorageEquippable = sourceStorageItem.getComponent("equippable");
                    sourceItem = sourceStorageEquippable.storage[sourceSlot];
                } else if (classList.contains("belt-slot")) {
                    const sourceSlot = target.getAttribute("data-index");
                    const playerEquipment = engine.player.getComponent("equipment");
                    if (playerEquipment) {
                        const beltItem = playerEquipment.getItem(7);
                        if (beltItem) {
                            const beltEquippable = beltItem.getComponent("equippable");
                            sourceItem = beltEquippable.storage[sourceSlot];
                        }
                    }
                }

                if (sourceItem) {
                    const consumable = sourceItem.getComponent("consumable");
                    if (consumable) {
                        this.hideItemTooltip();
                        if (engine.processAction(consumable.getAction())) {
                            inventory.populateInventory(engine.player);
                        }
                    }
                }
            } else if (classList.contains("stat__level")) {
                const level = engine.player.getComponent("level");
                if (level.statPointsAvailable > 0) {
                    const fighter = engine.player.getComponent("fighter");
                    const parentClasses = target.parentNode.classList;
                    if (parentClasses.contains("stat--strength")) {
                        fighter.strength += 1;
                        fighter.recalculateStats();
                        level.useStatPoint();
                    } else if (parentClasses.contains("stat--agility")) {
                        fighter.agility += 1;
                        fighter.recalculateStats();
                        level.useStatPoint();
                    } else if (parentClasses.contains("stat--constitution")) {
                        fighter.constitution += 1;
                        fighter.recalculateStats();
                        level.useStatPoint();
                        characterHealth.update(fighter.hp, fighter.maxHp);
                    } else if (parentClasses.contains("stat--wisdom")) {
                        fighter.wisdom += 1;
                        fighter.recalculateStats();
                        level.useStatPoint();
                        characterMana.update(fighter.mana, fighter.maxMana);
                    }
                }
            } else if (classList.contains("hotbar__open-inventory")) {
                inventory.toggle();
            } else if (classList.contains("hotbar__open-character")) {
                character.toggle();
            } else if (classList.contains("hotbar__open-skill")) {
                //skills.toggle();
            }
        }
    }

    onMouseDown(e) {
        const target = e.target;
        const isSlot = target.classList.contains("slot") && !target.classList.contains("belt-slot");
        if (isSlot && target.classList.contains("has-item")) {
            // Handle adding gold to inventory
            if (target.classList.contains("pickup-slot")) {
                const index = target.getAttribute("data-index");
                const item = inventory.itemsOnGround[index];
                if (item) {
                    const playerInventory = engine.player.getComponent("inventory");
                    if (playerInventory.add(item)) {
                        engine.gameMap.removeItem(item);
                        item.getComponent("positionalobject").teardown();
                        engine.fov.remove(item);
                        inventory.populateInventory(engine.player);
                        engine.needsMapUpdate = true;
                        return;
                    }
                }
            }

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

            const playerEquipment = engine.player.getComponent("equipment");

            const target = e.target;
            const sourceIsGround = this.slotDragging.classList.contains("pickup-slot");
            const sourceIsInventorySlot = this.slotDragging.classList.contains("inventory__storage-slot");
            const sourceIsEquipmentSlot = this.slotDragging.classList.contains("inventory__equipment-slot");
            const targetIsGround = target.classList.contains("pickup-slot");
            const targetIsInventorySlot = target.classList.contains("inventory__storage-slot");
            const targetIsEquipmentSlot = target.classList.contains("inventory__equipment-slot");

            const sourceSlot = this.slotDragging.getAttribute("data-index");
            const targetSlot = target.getAttribute("data-index");
            if ((targetIsGround || targetIsInventorySlot || targetIsEquipmentSlot) && !target.classList.contains("disabled")) {
                if (sourceIsGround) {
                    const sourceItem = inventory.itemsOnGround[sourceSlot];
                    if (targetIsEquipmentSlot) {
                        const fromEquippable = sourceItem.getComponent("equippable");
                        if (fromEquippable && fromEquippable.slot === playerEquipment.items[targetSlot].slot) {
                            const targetItem = playerEquipment.getItem(targetSlot);
                            if (targetItem) {
                                engine.processAction(new DropFromEquipmentAction(engine.player, targetItem));
                            }

                            playerEquipment.setItem(targetSlot, sourceItem);
                            sourceItem.parentEntity = playerEquipment;
                            engine.gameMap.removeItem(sourceItem);
                            sourceItem.getComponent("positionalobject").teardown();
                            engine.fov.remove(sourceItem);
                            engine.needsMapUpdate = true;

                            inventory.populateInventory(engine.player);
                            bottomContainer.updateBeltSlots();
                            engine.player.callEvent("onEquipmentChange");
                        }
                    } else if (targetIsInventorySlot) {
                        const targetStorage = target.parentNode.getAttribute("data-index");
                        const storageItem = inventory.openStorages[targetStorage];
                        const storageEquippable = storageItem.getComponent("equippable");
                        const targetItem = storageEquippable.storage[targetSlot];
                        if (targetItem) {
                            storageEquippable.drop(targetItem);
                        }

                        storageEquippable.setItem(targetSlot, sourceItem);
                        sourceItem.parentEntity = storageEquippable;
                        engine.gameMap.removeItem(sourceItem);
                        sourceItem.getComponent("positionalobject").teardown();
                        engine.fov.remove(sourceItem);
                        engine.needsMapUpdate = true;

                        inventory.populateInventory(engine.player);
                        bottomContainer.updateBeltSlots();
                    }
                } else if (sourceIsEquipmentSlot) {
                    const sourceItem = playerEquipment.getItem(sourceSlot);
                    if (targetIsEquipmentSlot) {
                        if (targetSlot !== sourceSlot && playerEquipment.items[targetSlot].slot === playerEquipment.items[sourceSlot].slot) {
                            playerEquipment.move(sourceSlot, targetSlot);
                            inventory.populateInventory(engine.player);
                            bottomContainer.updateBeltSlots();
                            engine.player.callEvent("onEquipmentChange");
                        }
                    } else if (targetIsInventorySlot) {
                        const targetStorage = target.parentNode.getAttribute("data-index");
                        const storageItem = inventory.openStorages[targetStorage];

                        if (sourceItem === storageItem) {
                            messageConsole.text("You can't put " + sourceItem.name + " inside itself!").build();
                            return;
                        }

                        const storageEquippable = storageItem.getComponent("equippable");
                        const targetItem = storageEquippable.storage[targetSlot];
                        if (targetItem) {
                            const fromEquippable = sourceItem.getComponent("equippable");
                            // Invalid slot
                            if (fromEquippable && fromEquippable.slot !== playerEquipment.items[targetSlot].slot) {
                                return;
                            }
                        }

                        playerEquipment.setItem(sourceSlot, targetItem);
                        storageEquippable.setItem(targetSlot, sourceItem);
                        sourceItem.parentEntity = playerEquipment;

                        inventory.populateInventory(engine.player);
                        bottomContainer.updateBeltSlots();
                    } else if (targetIsGround) {
                        engine.processAction(new DropFromEquipmentAction(engine.player, sourceItem));
                        bottomContainer.updateBeltSlots();
                    }
                } else if (sourceIsInventorySlot) {
                    const sourceStorage = this.slotDragging.parentNode.getAttribute("data-index");
                    const sourceStorageItem = inventory.openStorages[sourceStorage];
                    const sourceStorageEquippable = sourceStorageItem.getComponent("equippable");
                    const sourceItem = sourceStorageEquippable.storage[sourceSlot];

                    if (targetIsEquipmentSlot) {
                        const fromEquippable = sourceItem.getComponent("equippable");
                        if (fromEquippable && fromEquippable.slot === playerEquipment.items[targetSlot].slot) {
                            const targetItem = playerEquipment.getItem(targetSlot);

                            let parent = sourceItem.parentEntity;
                            while(parent) {
                                if (parent === targetItem) {
                                    messageConsole.text("You can't equip a container from within its parent. Consider moving it elsewhere first.").build();
                                    return;
                                }
                                parent = parent.parentEntity;
                            }
                            playerEquipment.setItem(targetSlot, sourceItem);
                            sourceStorageEquippable.setItem(sourceSlot, targetItem);
                            sourceItem.parentEntity = playerEquipment;

                            inventory.populateInventory(engine.player);
                            bottomContainer.updateBeltSlots();
                            engine.player.callEvent("onEquipmentChange");
                        }
                    } else if (targetIsInventorySlot) {
                        const targetStorage = target.parentNode.getAttribute("data-index");
                        const targetStorageItem = inventory.openStorages[targetStorage];

                        if (sourceStorageItem === targetStorageItem) {
                            sourceStorageEquippable.move(sourceSlot, targetSlot);
                            inventory.populateInventory(engine.player);
                            bottomContainer.updateBeltSlots();
                        } else {
                            const targetStorageEquippable = targetStorageItem.getComponent("equippable");
                            const targetItem = targetStorageEquippable.storage[targetSlot];

                            sourceStorageEquippable.setItem(sourceSlot, targetItem);
                            if (targetItem) {
                                targetItem.parentEntity = sourceStorageEquippable;
                            }
                            targetStorageEquippable.setItem(targetSlot, sourceItem);
                            sourceItem.parentEntity = targetStorageEquippable;
                            inventory.populateInventory(engine.player);
                            bottomContainer.updateBeltSlots();
                        }
                    } else if (targetIsGround) {
                        sourceStorageEquippable.drop(sourceItem);
                        bottomContainer.updateBeltSlots();
                    }
                }
            } else if (target.tagName === "CANVAS") {
                if (sourceIsInventorySlot) {
                    const sourceStorage = this.slotDragging.parentNode.getAttribute("data-index");
                    const sourceStorageItem = inventory.openStorages[sourceStorage];
                    const sourceStorageEquippable = sourceStorageItem.getComponent("equippable");
                    const sourceItem = sourceStorageEquippable.storage[sourceSlot];

                    sourceStorageEquippable.drop(sourceItem);
                } else if (sourceIsEquipmentSlot) {
                    engine.processAction(new DropFromEquipmentAction(engine.player, playerEquipment.getItem(sourceSlot)));
                }
            }
        }
    }
}