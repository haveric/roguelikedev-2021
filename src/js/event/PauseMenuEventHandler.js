import EventHandler from "./_EventHandler";
import pauseMenu from "../ui/menu/PauseMenu";
import controls from "../controls/Controls";
import engine from "../Engine";

import DefaultPlayerEventHandler from "./DefaultPlayerEventHandler";
import LoadGameMenuEventHandler from "./LoadGameMenuEventHandler";
import ControlsMenuEventHandler from "./ControlsMenuEventHandler";
import SettingsMenuEventHandler from "./SettingsMenuEventHandler";
import CreditsMenuEventsHandler from "./CreditsMenuEventsHandler";
import SaveGameMenuEventHandler from "./SaveGameMenuEventHandler";
import MainMenuEventHandler from "./MainMenuEventHandler";

export default class PauseMenuEventHandler extends EventHandler {
    constructor(eventHandler) {
        super(eventHandler);

        pauseMenu.open();
    }

    teardown() {
        super.teardown();

        pauseMenu.close();
    }

    handleInput() {
        if (controls.testPressed("pause")) {
            engine.setEventHandler(new DefaultPlayerEventHandler());
        }
    }

    onLeftClick(e) {
        const target = e.target;
        const id = target.id;

        switch(id) {
            case "pausemenu__savegame":
                this.openSaveGameMenu();
                break;
            case "pausemenu__loadgame":
                this.openLoadGameMenu();
                break;
            case "pausemenu__controls":
                this.openControlsMenu();
                break;
            case "pausemenu__settings":
                this.openSettingsMenu();
                break;
            case "pausemenu__credits":
                this.openCreditsMenu();
                break;
            case "pausemenu__quit":
                this.quit();
                break;
            default:
                break;
        }

        if (target.classList.contains("menu__returntogame")) {
            engine.setEventHandler(new DefaultPlayerEventHandler());
        }
    }

    openSaveGameMenu() {
        engine.setEventHandler(new SaveGameMenuEventHandler(this));
    }

    openLoadGameMenu() {
        engine.setEventHandler(new LoadGameMenuEventHandler(this));
    }

    openControlsMenu() {
        engine.setEventHandler(new ControlsMenuEventHandler(this));
    }

    openSettingsMenu() {
        engine.setEventHandler(new SettingsMenuEventHandler(this));
    }

    openCreditsMenu() {
        engine.setEventHandler(new CreditsMenuEventsHandler(this));
    }

    quit() {
        engine.player = null;
        engine.setEventHandler(new MainMenuEventHandler());
    }
}