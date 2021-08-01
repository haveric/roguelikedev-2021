import html from '../../../html/menu/GameOver.html';
import UIElement from "../UIElement";

class GameOverMenu extends UIElement {
    constructor() {
        super(html);
    }
}

const gameOverMenu = new GameOverMenu();
export default gameOverMenu;