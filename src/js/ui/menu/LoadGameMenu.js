import html from '../../../html/menu/LoadGame.html';
import UIElement from "../UIElement";
import saveManager from "../../SaveManager";
import saveHtml from "../../../html/template/Save.html";

class LoadGameMenu extends UIElement {
    constructor() {
        super(html);

        this.oldSavesDom = this.dom.getElementsByClassName("loadgame__oldsaves")[0];
        this.loadSaves();
    }

    loadSaves() {
        const self = this;
        this.oldSavesDom.innerHTML = "";
        for (const [key, value] of Object.entries(saveManager.saves)) {
            const saveElement = this.htmlToElement(saveHtml);
            saveElement.getElementsByClassName("save__title")[0].innerText = key;
            self.oldSavesDom.appendChild(saveElement);
        }
    }
}

const loadGameMenu = new LoadGameMenu();
export default loadGameMenu;