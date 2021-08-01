import html from '../../../html/menu/SaveGame.html';
import saveHtml from '../../../html/template/Save.html';
import UIElement from "../UIElement";
import saveManager from "../../SaveManager";

class SaveGameMenu extends UIElement {
    constructor() {
        super(html);

        this.overwriteDom = this.dom.getElementsByClassName("savegame__overwrite")[0];
        this.oldSavesDom = this.dom.getElementsByClassName("savegame__oldsaves")[0];
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

const saveGameMenu = new SaveGameMenu();
export default saveGameMenu;