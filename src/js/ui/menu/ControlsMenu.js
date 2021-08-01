import html from '../../../html/menu/Controls.html';
import UIElement from "../UIElement";

class ControlsMenu extends UIElement {
    constructor() {
        super(html);
    }
}

const controlsMenu = new ControlsMenu();
export default controlsMenu;