import _Component from "./_Component";

export default class BlocksFov extends _Component {
    constructor(args = {}) {
        super(args, "blocksFov");
        const hasComponent = args.components && args.components.blocksFov !== undefined;

        // Whether the tile can be seen through
        this.blocksFov = false;

        if (hasComponent) {
            const type = typeof args.components.blocksFov;
            if (type === "boolean") {
                this.blocksFov = args.components.blocksFov;
            } else if (type === "object") {
                if (args.components.blocksFov) {
                    this.blocksFov = args.components.blocksFov.blocksFov;
                }
            }
        }
    }

    save() {
        if (this.cachedSave) {
            return this.cachedSave;
        }

        let saveJson;
        if (this.blocksFov) {
            saveJson = {
                blocksFov: this.blocksFov
            };
        } else {
            saveJson = {};
        }

        this.cachedSave = saveJson;
        return saveJson;
    }
}