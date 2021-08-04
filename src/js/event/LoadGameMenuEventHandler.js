import loadGameMenu from "../ui/menu/LoadGameMenu";
import MenuEventHandler from "./_MenuEventHandler";
import engine from "../Engine";
import saveManager from "../SaveManager";
import DefaultPlayerEventHandler from "./DefaultPlayerEventHandler";

export default class LoadGameMenuEventHandler extends MenuEventHandler {
    constructor(eventHandler) {
        super(eventHandler);

        loadGameMenu.loadSaves();
        loadGameMenu.open();
    }

    teardown() {
        super.teardown();

        loadGameMenu.close();
    }

    onLeftClick(e) {
        const target = e.target;
        const classList = target.classList;

        if (classList.contains("menu__back")) {
            this.returnToPreviousMenu();
        } else if (classList.contains("save__title")) {
            const textDom = target.getElementsByClassName("save__text")[0];
            saveManager.saveName = textDom.innerText;
            engine.load(saveManager.getCurrentSaveName());

            engine.setEventHandler(new DefaultPlayerEventHandler());
        } else if (classList.contains("save__delete")) {
            const saveToDelete = target.parentNode.getElementsByClassName("save__text")[0].innerText;
            saveManager.delete(saveToDelete);
            loadGameMenu.loadSaves();
        }
    }
}