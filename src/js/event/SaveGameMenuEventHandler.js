import saveGameMenu from "../ui/menu/SaveGameMenu";
import MenuEventHandler from "./_MenuEventHandler";
import saveManager from "../SaveManager";

export default class SaveGameMenuEventHandler extends MenuEventHandler {
    constructor(eventHandler) {
        super(eventHandler);

        this.overwriteName = "";
        saveGameMenu.loadSaves();
        saveGameMenu.open();
    }

    teardown() {
        super.teardown();

        saveGameMenu.close();
    }

    onLeftClick(e) {
        const target = e.target;
        const classList = target.classList;

        if (saveGameMenu.overwriteDom.classList.contains("active")) {
            if (classList.contains("save__overwrite")) {
                saveManager.saveName = this.overwriteName;
                saveManager.save();

                saveGameMenu.loadSaves();
                saveGameMenu.overwriteDom.classList.remove("active");
            } else if (classList.contains("save__overwrite-cancel")) {
                saveGameMenu.overwriteDom.classList.remove("active");
            }
        } else {
            if (classList.contains("menu__back")) {
                this.returnToPreviousMenu();
            } else if (classList.contains("save__confirm")) {
                const input = saveGameMenu.dom.getElementsByClassName("savegame__newsave-input")[0];
                const newSaveName = input.value;

                if (saveManager.saves[newSaveName] !== undefined) {
                    const overwriteTitleDom = saveGameMenu.overwriteDom.getElementsByClassName("savegame__overwrite-title")[0];
                    overwriteTitleDom.innerText = newSaveName + " already exists. Overwrite?";
                    this.overwriteName = newSaveName;
                    saveGameMenu.overwriteDom.classList.add("active");
                } else {
                    saveManager.saveName = newSaveName;
                    saveManager.save();
                    saveGameMenu.loadSaves();
                }
            } else if (classList.contains("save__title")) {
                const textDom = target.getElementsByClassName("save__text")[0];
                const saveName = textDom.innerText;
                const overwriteTitleDom = saveGameMenu.overwriteDom.getElementsByClassName("savegame__overwrite-title")[0];
                overwriteTitleDom.innerText = "Overwrite " + saveName + "?";
                this.overwriteName = saveName;
                saveGameMenu.overwriteDom.classList.add("active");
            } else if (classList.contains("save__delete")) {
                const saveToDelete = target.parentNode.getElementsByClassName("save__text")[0].innerText;
                saveManager.delete(saveToDelete);
                saveGameMenu.loadSaves();
            }
        }
    }
}