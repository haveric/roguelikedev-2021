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
            saveElement.getElementsByClassName("save__text")[0].innerText = key;
            saveElement.getElementsByClassName("save__date")[0].innerText = this.formatDate(value.date);
            saveElement.getElementsByClassName("save__time")[0].innerText = this.formatTime(value.date);
            self.oldSavesDom.appendChild(saveElement);
        }
    }

    formatDate(date) {
        const formatted = new Date(date);
        return formatted.getFullYear() + "-" + (formatted.getMonth() + 1) + "-" + formatted.getDate();
    }

    formatTime(date) {
        const formatted = new Date(date);
        return formatted.getHours() + ":" + formatted.getMinutes() + ":" + formatted.getSeconds();
    }
}

const saveGameMenu = new SaveGameMenu();
export default saveGameMenu;