import html from '../../html/ui/Character.html';
import UIElement from "./UIElement";
import engine from "../Engine";

class Character extends UIElement {
    constructor() {
        super(html);

        this.strengthDom = this.dom.getElementsByClassName("stat--strength")[0].getElementsByClassName("stat__text")[0];
        this.damageDom = this.dom.getElementsByClassName("attribute--damage")[0].getElementsByClassName("attribute__value")[0];

        this.agilityDom = this.dom.getElementsByClassName("stat--agility")[0].getElementsByClassName("stat__text")[0];
        this.defenseDom = this.dom.getElementsByClassName("attribute--defense")[0].getElementsByClassName("attribute__value")[0];
        this.blockChanceDom = this.dom.getElementsByClassName("attribute--blockchance")[0].getElementsByClassName("attribute__value")[0];

        this.constitutionDom = this.dom.getElementsByClassName("stat--constitution")[0].getElementsByClassName("stat__text")[0];
        this.healthDom = this.dom.getElementsByClassName("attribute--health")[0].getElementsByClassName("attribute__value")[0];

        this.wisomDom = this.dom.getElementsByClassName("stat--wisdom")[0].getElementsByClassName("stat__text")[0];
        this.manaDom = this.dom.getElementsByClassName("attribute--mana")[0].getElementsByClassName("attribute__value")[0];

        this.availableStatPointsDom = this.dom.getElementsByClassName("available-stats__value")[0];

        this.levelDom = this.dom.getElementsByClassName("character__level-value")[0];
        this.currentXpDom = this.dom.getElementsByClassName("character__current-xp")[0];
        this.neededXpDom = this.dom.getElementsByClassName("character__needed-xp")[0];

        this.xpFilledDom = this.dom.getElementsByClassName("character__xp-filled")[0];
    }

    populate(player) {
        const fighter = player.getComponent("fighter");
        this.strengthDom.innerText = fighter.strength;
        this.damageDom.innerText = fighter.getDamageDisplay();

        this.agilityDom.innerText = fighter.agility;
        this.defenseDom.innerText = fighter.defense;
        this.blockChanceDom.innerText = fighter.blockChance + "%";

        this.constitutionDom.innerText = fighter.constitution;
        this.healthDom.innerText = fighter.hp + " / " + fighter.maxHp;

        this.wisomDom.innerText = fighter.wisdom;
        this.manaDom.innerText = fighter.mana + " / " + fighter.maxMana;

        const level = player.getComponent("level");
        if (level.statPointsAvailable) {
            this.dom.classList.add("has-statpoint");
        } else {
            this.dom.classList.remove("has-statpoint");
        }

        this.availableStatPointsDom.innerText = level.statPointsAvailable;

        this.levelDom.innerText = level.level;
        this.currentXpDom.innerText = level.xp;
        this.neededXpDom.innerText = level.xpForLevel(level.level);
        this.xpFilledDom.style.width = level.getPercentXPTowardsLevel() + "%";
    }

    toggle() {
        if (this.isOpen()) {
            this.close();
        } else {
            this.populate(engine.player);
            this.open();
        }
    }
}

const character = new Character();
export default character;