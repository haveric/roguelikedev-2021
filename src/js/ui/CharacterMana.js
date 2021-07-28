import html from '../../html/CharacterMana.html';
import UIElement from "./UIElement";

class CharacterMana extends UIElement {
    constructor() {
        super(html);

        this.fgDom = this.dom.getElementsByClassName("character-info__fg")[0];
        this.textDom = this.dom.getElementsByClassName("character-info__text")[0];
    }

    update(current, max) {
        const percent = current / max;
        const height = percent * 76;
        this.fgDom.style.height = (100 - height) + "%";

        this.textDom.innerText = current + " / " + max;
    }
}

const characterMana = new CharacterMana();
export default characterMana;