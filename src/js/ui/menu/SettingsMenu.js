import html from "../../../html/menu/Settings.html";
import UIElement from "../UIElement";

class SettingsMenu extends UIElement {
    constructor() {
        super(html);

        this.showStats = true;
    }
}

const settingsMenu = new SettingsMenu();
export default settingsMenu;