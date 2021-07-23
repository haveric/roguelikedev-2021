class Inventory {
    constructor() {
        this.dom = document.createElement("div");
        this.dom.classList.add("inventory");

        this.equipmentDom = document.createElement("div");
        this.equipmentDom.classList.add("inventory__equipment");

        this.storageDom = document.createElement("div");
        this.storageDom.classList.add("inventory__storage");

        this.itemTooltipDom = document.createElement("div");
        this.itemTooltipDom.classList.add("item__tooltip");

        this.slots = [];
        for (let i = 0; i < 40; i++) {
            const slot = document.createElement("div");
            slot.classList.add("inventory__storage-slot");
            slot.setAttribute("data-index", i);
            this.slots.push(slot);
            this.storageDom.appendChild(slot);
        }

        this.goldDisplayDom = document.createElement("div");
        this.goldDisplayDom.classList.add("inventory__golddisplay");

        this.dom.appendChild(this.equipmentDom);
        this.dom.appendChild(this.storageDom);
        this.dom.appendChild(this.goldDisplayDom);
    }

    isOpen() {
        return this.dom.classList.contains("active");
    }

    open() {
        this.dom.classList.add("active");
    }

    close() {
        this.dom.classList.remove("active");
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
                        let html = "<div class='item' style='color:" + itemPosition.color + "'>" + itemPosition.letter;

                        if (inventoryItem.amount > 1) {
                            html += "<span class='item__amount'>" + inventoryItem.amount + "</span>";
                        }

                        html += "<div class='item__details'>"
                            + "<span class='item__name'>" + inventoryItem.name + "</span>"
                            + "</div></div>";

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
            this.goldDisplayDom.innerText = inventory.gold + " Gold";
        }
    }
}

const inventory = new Inventory();
export default inventory;