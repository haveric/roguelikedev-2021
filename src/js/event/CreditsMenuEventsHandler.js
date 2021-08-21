import creditsMenu from "../ui/menu/CreditsMenu";
import MenuEventHandler from "./_MenuEventHandler";

export default class CreditsMenuEventsHandler extends MenuEventHandler {
    constructor(eventHandler) {
        super(eventHandler);
        const self = this;

        creditsMenu.open();
        this.timeout = setTimeout(function() {
            self.onLeftClick();
        }, 31000);
    }

    teardown() {
        super.teardown();

        clearTimeout(this.timeout);
        creditsMenu.close();
    }

    onLeftClick(/*e*/) {
        this.returnToPreviousMenu();
    }
}