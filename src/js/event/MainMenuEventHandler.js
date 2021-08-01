import EventHandler from "./_EventHandler";
import DefaultPlayerEventHandler from "./DefaultPlayerEventHandler";
import engine from "../Engine";
import BasicDungeon from "../map/BasicDungeon";
import messageConsole from "../ui/MessageConsole";
import mainMenu from "../ui/menu/MainMenu";
import LoadGameMenuEventHandler from "./LoadGameMenuEventHandler";
import ControlsMenuEventHandler from "./ControlsMenuEventHandler";
import SettingsMenuEventHandler from "./SettingsMenuEventHandler";
import CreditsMenuEventsHandler from "./CreditsMenuEventsHandler";

export default class MainMenuEventHandler extends EventHandler {
    constructor() {
        super();

        mainMenu.open();
    }

    teardown() {
        super.teardown();

        mainMenu.close();
    }

    onLeftClick(e) {
        const target = e.target;
        const id = target.id;

        switch(id) {
            case "mainmenu__newgame":
                this.startNewGame();
                break;
            case "mainmenu__loadgame":
                this.openLoadGameMenu();
                break;
            case "mainmenu__controls":
                this.openControlsMenu();
                break;
            case "mainmenu__settings":
                this.openSettingsMenu();
                break;
            case "mainmenu__credits":
                this.openCreditsMenu();
                break;
            default:
                break;
        }
    }

    startNewGame() {
        engine.gameMap.teardown();
        engine.setEventHandler(new DefaultPlayerEventHandler());

        engine.gameMap = new BasicDungeon(100, 100);
        engine.gameMap.create();
        engine.needsMapUpdate = true;
        messageConsole.text("Welcome adventurer!").build();
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
}