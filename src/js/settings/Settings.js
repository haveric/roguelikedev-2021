export default class Settings {
    constructor() {
        this.messageConsolePosition = "";

        this.autosavesEnabled = true;
        this.autosaveAmount = 3;
        this.autosaveTurns = 100;
        this.displayFPS = false;
        this.debugControlsEnabled = false;

        this.load();
    }

    load() {
        const settings = localStorage.getItem("settings");
        if (settings) {
            const json = JSON.parse(settings);
            if (json.messageConsolePosition !== undefined) {
                this.messageConsolePosition = json.messageConsolePosition;
            }
            if (json.autosavesEnabled !== undefined) {
                this.autosavesEnabled = json.autosavesEnabled;
            }
            if (json.autosaveAmount !== undefined) {
                this.autosaveAmount = json.autosaveAmount;
            }
            if (json.autosaveTurns !== undefined) {
                this.autosaveTurns = json.autosaveTurns;
            }
            if (json.displayFPS !== undefined) {
                this.displayFPS = json.displayFPS;
            }
            if (json.debugControlsEnabled !== undefined) {
                this.debugControlsEnabled = json.debugControlsEnabled;
            }
        }
    }

    save() {
        const toSave = {
            messageConsolePosition: this.messageConsolePosition,
            autosavesEnabled: this.autosavesEnabled,
            autosaveAmount: this.autosaveAmount,
            autosaveTurns: this.autosaveTurns,
            displayFPS: this.displayFPS,
            debugControlsEnabled: this.debugControlsEnabled
        };

        localStorage.setItem("settings", JSON.stringify(toSave));
    }
}