import settingsMenu from "../ui/menu/SettingsMenu";
import MenuEventHandler from "./_MenuEventHandler";

export default class SettingsMenuEventHandler extends MenuEventHandler {
    constructor(eventHandler) {
        super(eventHandler);

        settingsMenu.open();
    }

    teardown() {
        super.teardown();

        settingsMenu.close();
    }

    onLeftClick(e) {
        const target = e.target;
        const classList = target.classList;

        if (classList.contains("menu__save")) {
            this.saveAndExit();
        } else if (classList.contains("menu__cancel")) {
            this.cancel();
        }
    }

    saveAndExit() {
        this.returnToPreviousMenu();
    }

    cancel() {
        this.returnToPreviousMenu();
    }
}