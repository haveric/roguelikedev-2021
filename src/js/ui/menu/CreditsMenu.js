import html from "../../../html/menu/Credits.html";
import UIElement from "../UIElement";

class CreditsMenu extends UIElement {
    constructor() {
        super(html);
    }
}

const creditsMenu = new CreditsMenu();
export default creditsMenu;