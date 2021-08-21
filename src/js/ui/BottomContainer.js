import html from "../../html/ui/BottomContainer.html";
import UIElement from "./UIElement";
import characterHealth from "./CharacterHealth";
import characterMana from "./CharacterMana";
import engine from "../Engine";

class BottomContainer extends UIElement {
    constructor() {
        super(html);

        this.dom.getElementsByClassName("bottom-container__left")[0].appendChild(characterHealth.dom);
        this.dom.getElementsByClassName("bottom-container__right")[0].appendChild(characterMana.dom);

        this.xpFilledDom = this.dom.getElementsByClassName("character__xp-filled")[0];

        this.openCharacter = this.dom.getElementsByClassName("hotbar__open-character")[0];
        this.openSkills = this.dom.getElementsByClassName("hotbar__open-skill")[0];

        this.beltSlotsDom = this.dom.getElementsByClassName("belt-slots")[0];
    }

    updateAll() {
        this.updateXp();
        this.updateStatPointsIndicator();
        this.updateSkillPointsIndicator();
        this.updateBeltSlots();
    }

    updateXp() {
        const level = engine.player.getComponent("level");
        this.xpFilledDom.style.width = level.getPercentXPTowardsLevel() + "%";
    }

    updateStatPointsIndicator() {
        const level = engine.player.getComponent("level");
        const statPointsAvailable = level.statPointsAvailable;
        if (statPointsAvailable > 0) {
            this.openCharacter.classList.add("has-statpoint");
        } else {
            this.openCharacter.classList.remove("has-statpoint");
        }
    }

    updateSkillPointsIndicator() {
        const level = engine.player.getComponent("level");
        const skillPointsAvailable = level.skillPointsAvailable;
        if (skillPointsAvailable > 0) {
            this.openSkills.classList.add("has-skillpoint");
        } else {
            this.openSkills.classList.remove("has-skillpoint");
        }
    }

    updateBeltSlots() {
        this.beltSlotsDom.innerHTML = "";
        const playerEquipment = engine.player.getComponent("equipment");
        if (playerEquipment) {
            // Get belt
            const equipmentBeltItem = playerEquipment.items[7];
            const beltItem = equipmentBeltItem.item;
            if (beltItem) {
                const beltEquippable = beltItem.getComponent("equippable");
                if (beltEquippable) {
                    for (let i = 0; i < beltEquippable.maxStorage; i++) {
                        const beltSlotDom = document.createElement("div");
                        beltSlotDom.classList.add("slot", "belt-slot");
                        beltSlotDom.setAttribute("data-index", i);

                        if (beltEquippable.storage.length >= i) {
                            const storageItem = beltEquippable.storage[i];
                            this.populateSlot(beltSlotDom, storageItem);
                        }

                        this.beltSlotsDom.appendChild(beltSlotDom);
                    }
                }
            }
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
}

const bottomContainer = new BottomContainer();
export default bottomContainer;