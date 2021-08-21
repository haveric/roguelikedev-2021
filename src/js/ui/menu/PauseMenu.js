import html from "../../../html/menu/PauseMenu.html";
import UIElement from "../UIElement";

class PauseMenu extends UIElement {
    constructor() {
        super(html);
    }
}

const pauseMenu = new PauseMenu();
export default pauseMenu;