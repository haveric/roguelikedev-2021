import _Component from "./_Component";

export default class BlocksMovement extends _Component {
    constructor(args = {}) {
        super(args, "blocksMovement");
        const hasComponent = args.components && args.components.blocksMovement !== undefined;

        // Whether the tile can moved into
        this.blocksMovement = false;

        if (hasComponent) {
            const type = typeof args.components.blocksMovement;
            if (type === "boolean") {
                this.blocksMovement = args.components.blocksMovement;
            } else if (type === "object") {
                if (args.components.blocksMovement) {
                    this.blocksMovement = args.components.blocksMovement.blocksMovement;
                }
            }
        }
    }

    save() {
        if (this.cachedSave) {
            return this.cachedSave;
        }

        let saveJson;
        if (this.blocksMovement) {
            saveJson = {
                blocksMovement: this.blocksMovement
            };
        } else {
            saveJson = {};
        }

        this.cachedSave = saveJson;
        return saveJson;
    }

    onEntityDeath() {
        this.blocksMovement = false;

        this.clearSaveCache();
    }
}