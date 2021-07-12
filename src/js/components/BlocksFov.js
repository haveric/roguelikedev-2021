import _Component from "./_Component";

export default class BlocksFov extends _Component {
    constructor(args = {}) {
        super({...args, ...{baseType: "blocksFov"}});
        const hasComponent = args.components && args.components.blocksFov;

        if (hasComponent) {
            // Whether the tile can be seen through
            this.blocksFov = args.components.blocksFov.blocksFov || false;
        }
    }

    save() {
        return {
            blocksFov: this.blocksFov
        }
    }
}