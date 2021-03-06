import AI from "./_AI";

export default class AIDead extends AI {
    constructor(args = {}) {
        super(args, "aiDead");
        const hasComponent = args.components && args.components.aiDead !== undefined;

        this.previousAI = "";

        if (hasComponent) {
            const aiDead = args.components.aiDead;
            if (aiDead && aiDead.previousAI) {
                this.previousAI = aiDead.previousAI;
            }
        }
    }

    save() {
        if (this.cachedSave) {
            return this.cachedSave;
        }

        const saveJson = {
            "aiDead": {
                "previousAI": this.previousAI
            }
        };

        this.cachedSave = saveJson;
        return saveJson;
    }

    perform() {}
}