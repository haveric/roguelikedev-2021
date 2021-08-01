import html from '../../../html/menu/MainMenu.html';
import UIElement from "../UIElement";

class MainMenu extends UIElement {
    constructor() {
        super(html);
    }
}

const mainMenu = new MainMenu();
export default mainMenu;