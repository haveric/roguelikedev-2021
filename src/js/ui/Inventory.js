import html from "../../html/ui/Inventory.html";
import UIElement from "./UIElement";
import engine from "../Engine";

class Inventory extends UIElement {
    constructor() {
        super(html);

        this.equipmentDom = this.dom.getElementsByClassName("inventory__equipment")[0];
        this.equipmentSlots = [];
        for (let i = 0; i < 12; i++ ) {
            const slot = document.createElement("div");
            slot.classList.add("slot", "inventory__equipment-slot");
            slot.setAttribute("data-index", i);
            this.equipmentSlots.push(slot);
            this.equipmentDom.appendChild(slot);
        }

        this.storageWrapDom = this.dom.getElementsByClassName("inventory__storage-wrap")[0];
        this.goldCountDom = this.dom.getElementsByClassName("inventory__gold-count")[0];

        this.itemTooltipDom = document.createElement("div");
        this.itemTooltipDom.classList.add("item__tooltip");

        this.itemDragDom = document.createElement("div");
        this.itemDragDom.classList.add("item__drag");

        document.body.appendChild(this.itemTooltipDom);
        document.body.appendChild(this.itemDragDom);

        this.openStorages = [];
        this.itemsOnGround = [];
    }

    populateInventory(entity) {
        const equipment = entity.getComponent("equipment");
        if (equipment) {
            this.storageWrapDom.innerHTML = "";
            for (let i = 0; i < this.equipmentSlots.length; i++) {
                const slot = this.equipmentSlots[i];

                const equipmentSlot = equipment.items[i];
                const item = equipmentSlot.item;
                this.populateSlot(slot, item);
            }

            this.openStorages = [];

            // Get storage
            const equipmentStorageItem = equipment.items[9];
            const storageItem = equipmentStorageItem.item;
            if (storageItem) {
                this.openEquipmentStorage(storageItem);
            }

            // Get belt
            const equipmentBeltItem = equipment.items[7];
            const beltItem = equipmentBeltItem.item;
            if (beltItem) {
                this.openEquipmentStorage(beltItem);
            }

            for (let i = 0; i < this.equipmentSlots.length; i++) {
                if (i === 7 || i === 9) {
                    continue;
                }

                const equipmentItem = equipment.items[i];
                const item = equipmentItem.item;
                if (item) {
                    this.openEquipmentStorage(item);
                }
            }
        }

        this.openGroundItems();

        const inventory = entity.getComponent("inventory");
        if (inventory) {
            this.goldCountDom.innerText = inventory.gold;
        }
    }

    openEquipmentStorage(item) {
        this.openStorages.push(item);
        const equippable = item.getComponent("equippable");
        if (equippable && equippable.maxStorage !== 0) {
            let maxItems;
            if (equippable.maxStorage === -1) {
                maxItems = equippable.storage.length + 1;
            } else {
                maxItems = equippable.maxStorage;
            }
            const inventoryStorageDom = document.createElement("div");
            inventoryStorageDom.classList.add("inventory__storage");
            inventoryStorageDom.setAttribute("data-index", this.openStorages.length - 1);
            const inventoryStorageTitleDom = document.createElement("div");
            inventoryStorageTitleDom.classList.add("inventory__storage-title");
            inventoryStorageTitleDom.innerText = item.name;
            inventoryStorageDom.appendChild(inventoryStorageTitleDom);
            this.inventorySlots = [];
            for (let i = 0; i < maxItems; i++) {
                const slot = document.createElement("div");
                slot.classList.add("slot", "inventory__storage-slot");
                slot.setAttribute("data-index", i);

                this.populateSlot(slot, equippable.storage[i]);
                this.inventorySlots.push(slot);
                inventoryStorageDom.appendChild(slot);
            }
            this.storageWrapDom.appendChild(inventoryStorageDom);
        }
    }

    populateItemsAtGround() {
        const position = engine.player.getComponent("positionalobject");
        this.itemsOnGround = [];
        for (const item of engine.gameMap.items) {
            const itemPosition = item.getComponent("positionalobject");
            if (position.x === itemPosition.x && position.y === itemPosition.y && position.z === itemPosition.z) {
                this.itemsOnGround.push(item);
            }
        }
    }

    openGroundItems() {
        if (this.isOpen()) {
            this.populateItemsAtGround();

            let maxItems = Math.ceil((this.itemsOnGround.length + 1) / 10) * 10;

            const inventoryStorageDom = document.createElement("div");
            inventoryStorageDom.classList.add("inventory__storage");
            const inventoryStorageTitleDom = document.createElement("div");
            inventoryStorageTitleDom.classList.add("inventory__storage-title");
            inventoryStorageTitleDom.innerText = "On Ground";
            inventoryStorageDom.appendChild(inventoryStorageTitleDom);
            this.inventorySlots = [];
            for (let i = 0; i < maxItems; i++) {
                const slot = document.createElement("div");
                slot.classList.add("slot", "pickup-slot");
                slot.setAttribute("data-index", i);

                this.populateSlot(slot, this.itemsOnGround[i]);
                this.inventorySlots.push(slot);
                inventoryStorageDom.appendChild(slot);
            }
            this.storageWrapDom.appendChild(inventoryStorageDom);
        }
    }

    populateSlot(slot, item) {
        if (item) {
            const itemPosition = item.getComponent("positionalobject");
            if (itemPosition) {
                let rotation = "";
                if (itemPosition.zRot !== 0) {
                    rotation = "transform: rotate(" + (itemPosition.zRot * 180) + "deg);";
                }
                slot.classList.add("has-item");
                let html = "<div class='item' style='color:" + itemPosition.color + ";" + rotation + "'><div class='item__icon'>" + itemPosition.letter + "</div>";

                if (item.amount > 1) {
                    html += "<span class='item__amount'>" + item.amount + "</span>";
                }

                html += "<div class='item__details'>"
                    + "<span class='item__details-line item__name'>" + item.name + "</span>";
                if (item.description) {
                    html += "<span class='item__details-line item__description'>" + item.description + "</span>";
                }

                html += "<span class='item__details-line'><hr/></span>";

                html += item.getComponentDescriptions();

                html += "</div></div>";

                slot.innerHTML = html;
            }
        } else {
            slot.classList.remove("has-item");
            slot.innerHTML = "";
        }
    }

    toggle() {
        if (this.isOpen()) {
            this.close();
        } else {
            this.open();
            this.populateInventory(engine.player);
        }
    }
}

const inventory = new Inventory();
export default inventory;