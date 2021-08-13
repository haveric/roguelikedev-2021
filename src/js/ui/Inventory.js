import html from '../../html/ui/Inventory.html';
import UIElement from "./UIElement";
import engine from "../Engine";

class Inventory extends UIElement {
    constructor() {
        super(html);

        this.equipmentDom = this.dom.getElementsByClassName("inventory__equipment")[0];
        this.equipmentSlots = [];
        for (let i = 0; i < 12; i++ ) {
            const slot = document.createElement("div");
            slot.classList.add("inventory__equipment-slot");
            slot.setAttribute("data-index", i);
            this.equipmentSlots.push(slot);
            this.equipmentDom.appendChild(slot);
        }

        this.storageDom = this.dom.getElementsByClassName("inventory__storage")[0];
        this.inventorySlots = [];
        for (let i = 0; i < 40; i++) {
            const slot = document.createElement("div");
            slot.classList.add("inventory__storage-slot");
            slot.setAttribute("data-index", i);
            this.inventorySlots.push(slot);
            this.storageDom.appendChild(slot);
        }

        this.goldCountDom = this.dom.getElementsByClassName("inventory__gold-count")[0];

        this.itemTooltipDom = document.createElement("div");
        this.itemTooltipDom.classList.add("item__tooltip");

        this.itemDragDom = document.createElement("div");
        this.itemDragDom.classList.add("item__drag");

        document.body.appendChild(this.itemTooltipDom);
        document.body.appendChild(this.itemDragDom);
    }

    populateInventory(entity) {
        const equipment = entity.getComponent("equipment");
        if (equipment) {
            for (let i = 0; i < this.equipmentSlots.length; i++) {
                const slot = this.equipmentSlots[i];

                const equipmentSlot = equipment.items[i];
                const item = equipmentSlot.item;
                this.populateSlot(slot, item);
            }
        }

        const inventory = entity.getComponent("inventory");
        if (inventory) {
            for (let i = 0; i < this.inventorySlots.length; i++) {
                const slot = this.inventorySlots[i];

                const inventoryItem = inventory.items[i];
                this.populateSlot(slot, inventoryItem);

                if (i < inventory.capacity) {
                    slot.classList.remove("disabled");
                } else {
                    slot.classList.add("disabled");
                }
            }
            this.goldCountDom.innerText = inventory.gold;
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
                    html += "<span class='item__details-line item__description'>" + item.description + "</span>"
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
            this.populateInventory(engine.player);
            this.open();
        }
    }
}

const inventory = new Inventory();
export default inventory;