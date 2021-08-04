import engine from "./Engine";
import messageConsole from "./ui/MessageConsole";

class SaveManager {
    constructor() {
        this.saveName = "default";
        this.autosaveTurnCounter = 0;
        this.loadSaves();
    }

    getCurrentSaveName() {
        return "save-" + this.saveName;
    }

    save() {
        this.saveSaves();
        engine.save(this.getCurrentSaveName());
    }

    delete(saveToDelete) {
        delete this.saves[saveToDelete];
        this.save();

        if (this.saveName === saveToDelete) {
            this.saveName = "default";
        }
    }

    autosave() {
        const settings = engine.settings;
        if (settings.autosavesEnabled) {
            if (this.autosaveTurnCounter < settings.autosaveTurns) {
                this.autosaveTurnCounter ++;
                return;
            }

            this.autosaveTurnCounter = 0;

            let autosave;
            const lastAutosave = this.getLastAutosave();
            if (lastAutosave === -1) {
                autosave = 1;
            } else if (lastAutosave < settings.autosaveAmount) {
                autosave = lastAutosave + 1;
            } else {
                autosave = 1;
            }

            engine.save(this.getCurrentSaveName() + "-autosave" + autosave);

            this.setLastAutosave(autosave);
            messageConsole.text("Game autosaved.").build();
        }
    }

    loadSaves() {
        const saves = localStorage.getItem("saves");
        if (saves) {
            this.saves = JSON.parse(saves);
        } else {
            this.saves = {};
        }
    }

    saveSaves() {
        const save = this.saves[this.saveName];
        if (save === undefined) {
            this.saves[this.saveName] = {"name": this.getCurrentSaveName(), "lastAutosave": -1, "date": new Date()};
        }

        localStorage.setItem("saves", JSON.stringify(this.saves));
    }

    getLastAutosave() {
        let save = this.saves[this.saveName];
        if (save === undefined) {
            return -1;
        } else {
            return save.lastAutosave;
        }
    }

    setLastAutosave(autosave) {
        const save = this.saves[this.saveName];
        if (save === undefined) {
            this.saves[this.saveName] = {"name": this.getCurrentSaveName(), "lastAutosave": autosave};
        } else {
            save.lastAutosave = autosave;
        }

        this.saveSaves();
    }
}

const saveManager = new SaveManager();
export default saveManager;