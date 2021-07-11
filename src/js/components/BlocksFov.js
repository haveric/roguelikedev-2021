import _Component from "./_Component";

export default class BlocksFov extends _Component {
    constructor(args = {}) {
        if (args.components && args.components.blocksFov) {
            args = {...args, ...args.components.blocksFov};
        }
        super({...args, ...{baseType: "blocksFov"}});


        // Whether the tile can be seen through
        this.blocksFov = args.blocksFov || false;
    }

    save() {
        return {
            blocksFov: this.blocksFov
        }
    }
}