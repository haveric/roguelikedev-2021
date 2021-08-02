import settingsMenu from "../ui/menu/SettingsMenu";
import MenuEventHandler from "./_MenuEventHandler";
import Settings from "../settings/Settings";
import engine from "../Engine";
import sceneState from "../SceneState";

export default class SettingsMenuEventHandler extends MenuEventHandler {
    constructor(eventHandler) {
        super(eventHandler);

        this.tempSettings = new Settings();
        this.populateSettings();
        settingsMenu.open();
    }

    teardown() {
        super.teardown();

        settingsMenu.close();
    }

    onLeftClick(e) {
        const target = e.target;
        const id = target.id;
        const classList = target.classList;

        if (classList.contains("menu__save")) {
            this.saveAndExit();
        } else if (classList.contains("menu__cancel")) {
            this.cancel();
        } else if (id === "setting-displayfps") {
            this.tempSettings.displayFPS = target.checked;
            this.applyDisplayFPS(this.tempSettings);
        } else if (id === "setting-autosavesenabled") {
            this.tempSettings.autosavesEnabled = target.checked;
            this.applyAutosavesEnabled(this.tempSettings);
        }
    }

    onChange(e) {
        const target = e.target;
        const id = target.id;

        if (id === "setting-autosaveamount") {
            let newSaveAmount = parseInt(target.value);
            if (newSaveAmount) {
                if (newSaveAmount < 1) {
                    target.value = 1;
                    newSaveAmount = 1;
                } else if (newSaveAmount > 9) {
                    target.value = 9;
                    newSaveAmount = 9;
                }
            } else {
                target.value = 3;
                newSaveAmount = 3;
            }

            this.tempSettings.autosaveAmount = newSaveAmount;
        } else if (id === "setting-autosaveturns") {
            let newTurnsAmount = parseInt(target.value);
            if (newTurnsAmount) {
                if (newTurnsAmount < 10) {
                    target.value = 10;
                    newTurnsAmount = 10;
                } else if (newTurnsAmount > 1000) {
                    target.value = 1000;
                    newTurnsAmount = 1000;
                }
            } else {
                target.value = 100;
                newTurnsAmount = 100;
            }

            this.tempSettings.autosaveTurns = newTurnsAmount;
        }
    }

    saveAndExit() {
        engine.settings = this.tempSettings;
        engine.settings.save();
        this.returnToPreviousMenu();
    }

    cancel() {
        this.applyAllSettings(engine.settings);
        this.returnToPreviousMenu();
    }

    populateSettings() {
        const displayFPSCheckbox = document.getElementById("setting-displayfps");
        displayFPSCheckbox.checked = this.tempSettings.displayFPS;

        const autosavesEnabledCheckbox = document.getElementById("setting-autosavesenabled");
        autosavesEnabledCheckbox.checked = this.tempSettings.autosavesEnabled;

        const autosaveAmountInput = document.getElementById("setting-autosaveamount");
        autosaveAmountInput.value = this.tempSettings.autosaveAmount;

        const autosaveTurnsInput = document.getElementById("setting-autosaveturns");
        autosaveTurnsInput.value = this.tempSettings.autosaveTurns;
    }

    applyAllSettings(settings) {
        this.applyDisplayFPS(settings);
        this.applyAutosavesEnabled(settings);
    }

    applyDisplayFPS(settings) {
        sceneState.updateStatsVisibility(settings);
    }

    applyAutosavesEnabled(settings) {
        const autosaveAmountInput = document.getElementById("setting-autosaveamount");
        const autosaveTurnsInput = document.getElementById("setting-autosaveturns");
        if (settings.autosavesEnabled) {
            autosaveAmountInput.removeAttribute("disabled");
            autosaveTurnsInput.removeAttribute("disabled");
        } else {
            autosaveAmountInput.setAttribute("disabled", "disabled");
            autosaveTurnsInput.setAttribute("disabled", "disabled");
        }
    }
}