import AI from "./_AI";

export default class AIPlayer extends AI {
    constructor(args = {}) {
        super(args, "aiPlayer");
    }

    save() {
        if (this.cachedSave) {
            return this.cachedSave;
        }

        const saveJson = {
            "aiPlayer": {}
        };

        this.cachedSave = saveJson;
        return saveJson;
    }

    perform() {}
}