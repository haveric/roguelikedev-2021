import html from '../../html/ui/Inventory.html';
import UIElement from "./UIElement";
import engine from "../Engine";

class Inventory extends UIElement {
    constructor() {
        super(html);

        this.storageDom = this.dom.getElementsByClassName("inventory__storage")[0];

        this.slots = [];
        for (let i = 0; i < 40; i++) {
            const slot = document.createElement("div");
            slot.classList.add("inventory__storage-slot");
            slot.setAttribute("data-index", i);
            this.slots.push(slot);
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
        const inventory = entity.getComponent("inventory");
        if (inventory) {
            for (let i = 0; i < this.slots.length; i++) {
                const slot = this.slots[i];

                const inventoryItem = inventory.items[i];
                if (inventoryItem) {
                    const itemPosition = inventoryItem.getComponent("positionalobject");
                    if (itemPosition) {
                        slot.classList.add("has-item");
                        let html = "<div class='item' style='color:" + itemPosition.color + "'><div class='item__icon'>" + itemPosition.letter + "</div>";

                        if (inventoryItem.amount > 1) {
                            html += "<span class='item__amount'>" + inventoryItem.amount + "</span>";
                        }

                        html += "<div class='item__details'>"
                            + "<span class='item__details-line item__name'>" + inventoryItem.name + "</span>";
                        if (inventoryItem.description) {
                            html += "<span class='item__details-line item__description'>" + inventoryItem.description + "</span>"
                        }

                        html += "<span class='item__details-line'><hr/></span>";

                        html += inventoryItem.getComponentDescriptions();

                        html += "</div></div>";

                        slot.innerHTML = html;
                    }
                } else {
                    slot.classList.remove("has-item");
                    slot.innerHTML = "";
                }

                if (i < inventory.capacity) {
                    slot.classList.remove("disabled");
                } else {
                    slot.classList.add("disabled");
                }
            }
            this.goldCountDom.innerText = inventory.gold;
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