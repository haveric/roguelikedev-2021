import EventHandler from "./_EventHandler";
import gameOverMenu from "../ui/menu/GameOverMenu";
import engine from "../Engine";
import MainMenuEventHandler from "./MainMenuEventHandler";

export default class GameOverEventHandler extends EventHandler {
    constructor() {
        super();

        gameOverMenu.open();
    }

    teardown() {
        super.teardown();

        gameOverMenu.close();
    }

    onLeftClick(e) {
        const target = e.target;
        const classList = target.classList;

        if (classList.contains("menu__return")) {
            this.returnToMainMenu();
        }
    }

    returnToMainMenu() {
        engine.setEventHandler(new MainMenuEventHandler());
    }
}