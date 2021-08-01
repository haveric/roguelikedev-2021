import controlsMenu from "../ui/menu/ControlsMenu";
import MenuEventHandler from "./_MenuEventHandler";

export default class ControlsMenuEventHandler extends MenuEventHandler {
    constructor(eventHandler) {
        super(eventHandler);

        controlsMenu.open();
    }

    teardown() {
        super.teardown();

        controlsMenu.close();
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