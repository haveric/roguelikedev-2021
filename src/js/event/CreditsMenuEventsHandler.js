import creditsMenu from "../ui/menu/CreditsMenu";
import MenuEventHandler from "./_MenuEventHandler";

export default class CreditsMenuEventsHandler extends MenuEventHandler {
    constructor(eventHandler) {
        super(eventHandler);

        creditsMenu.open();
    }

    teardown() {
        super.teardown();

        creditsMenu.close();
    }

    onLeftClick(e) {
        this.returnToPreviousMenu();
    }
}