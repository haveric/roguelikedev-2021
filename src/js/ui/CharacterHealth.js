import html from '../../html/CharacterHealth.html';
import UIElement from "./UIElement";

class CharacterHealth extends UIElement {
    constructor() {
        super(html);

        this.fgDom = this.dom.getElementsByClassName("character-info__fg")[0];
        this.textDom = this.dom.getElementsByClassName("character-info__text")[0];
    }

    update(current, max) {
        const percent = current / max;
        const height = percent * 80;
        this.fgDom.style.height = height + "%";

        this.textDom.innerText = current + " / " + max;
    }
}

const characterHealth = new CharacterHealth();
export default characterHealth;