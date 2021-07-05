import _Component from "./_Component";

export default class BlocksMovement extends _Component {
    constructor(args = {}) {
        if (args.components && args.components.blocksMovement) {
            args = {...args, ...args.components.blocksMovement};
        }
        super({...args, ...{baseType: "blocksMovement"}});


        // Whether the tile can moved into
        this.blocksMovement = args.blocksMovement || false;
    }

    save() {
        return {
            blocksMovement: this.blocksMovement
        }
    }
}