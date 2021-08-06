import html from '../../html/ui/BottomContainer.html';
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
    }

    updateAll() {
        this.updateXp();
        this.updateStatPointsIndicator();
        this.updateSkillPointsIndicator();
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
}

const bottomContainer = new BottomContainer();
export default bottomContainer;