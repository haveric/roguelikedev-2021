import controlsMenu from "../ui/menu/ControlsMenu";
import MenuEventHandler from "./_MenuEventHandler";
import controls from "../controls/Controls";

export default class ControlsMenuEventHandler extends MenuEventHandler {
    constructor(eventHandler) {
        super(eventHandler);

        this.isEditingKey = false;
        this.editingDom = null;
        this.tempValue = null;

        this.tempControls = controls.clone();
        this.populateControls();
        controlsMenu.open();
    }

    teardown() {
        super.teardown();

        controlsMenu.close();
    }

    onLeftClick(e) {
        const target = e.target;
        const classList = target.classList;

        if (this.editingDom) {
            this.editingDom.value = this.tempValue;
            this.editingDom = null;
            this.isEditingKey = false;
        }

        if (classList.contains("menu__save")) {
            this.saveAndExit();
        } else if (classList.contains("menu__cancel")) {
            this.cancel();
        } else if (classList.contains("menu__reset")) {
            this.resetControls();
        } else {
            if (target.tagName === "INPUT") {
                this.tempValue = target.value;
                target.value = "";
                this.editingDom = target;
                this.isEditingKey = true;
            }
        }
    }

    onKeydown(e) {
        const target = e.target;
        if (this.isEditingKey && target.tagName === "INPUT") {
            const key = target.getAttribute("data-key");
            const index = target.getAttribute("data-index");

            const newKey = controls.getKey(e.key, e.code);
            target.value = newKey;
            e.preventDefault();
            target.blur();

            this.setKey(key, index, newKey);

            this.isEditingKey = false;
            this.editingDom = null;
        }
    }

    setKey(key, index, value) {
        const keys = this.tempControls.get(key);
        keys[index] = value;
    }

    saveAndExit() {
        controls.setControls(this.tempControls);
        this.returnToPreviousMenu();
    }

    cancel() {
        this.returnToPreviousMenu();
    }

    resetControls() {
        controls.resetToDefault();
        this.tempControls = controls.clone();
        this.populateControls();
    }

    populateControls() {
        // Movement
        this.populateControl("up", "control-moveup");
        this.populateControl("down", "control-movedown");
        this.populateControl("left", "control-moveleft");
        this.populateControl("right", "control-moveright");
        this.populateControl("nw", "control-movenw");
        this.populateControl("ne", "control-movene");
        this.populateControl("sw", "control-movesw");
        this.populateControl("se", "control-movese");
        this.populateControl("wait", "control-movewait");

        // Actions
        this.populateControl("inventory", "control-inventory");
        this.populateControl("character", "control-character");
        this.populateControl("closeall", "control-closeall");
        this.populateControl("get", "control-get");
        this.populateControl("look", "control-look");
        this.populateControl("pause", "control-pause");
        this.populateControl("interact", "control-interact");
        this.populateControl("quicksave", "control-quicksave");
        this.populateControl("quickload", "control-quickload");

        // Other
        this.populateControl("confirm", "control-confirm");
        this.populateControl("cancel", "control-cancel");
        this.populateControl("modifier-speed1", "control-targetingmodifier1");
        this.populateControl("modifier-speed2", "control-targetingmodifier2");
        this.populateControl("modifier-speed3", "control-targetingmodifier3");

        // Debug
        this.populateControl("debug", "control-revealmap");
        this.populateControl("debug2", "control-debugroom");
        this.populateControl("reset", "control-generatemap");
    }

    populateControl(keyName, id) {
        const keys = controls.controls.get(keyName);

        const primaryKey = document.getElementById(id);
        primaryKey.setAttribute("data-key", keyName);
        primaryKey.setAttribute("data-index", "0");
        if (keys.length > 0) {
            primaryKey.value = keys[0];
        } else {
            primaryKey.value = "";
        }

        const secondaryKey = document.getElementById(id + "-alt");
        secondaryKey.setAttribute("data-key", keyName);
        secondaryKey.setAttribute("data-index", "1");
        if (keys.length > 1) {
            secondaryKey.value = keys[1];
        } else {
            secondaryKey.value = "";
        }
    }
}