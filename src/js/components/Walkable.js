import _Component from "./_Component";

export default class Walkable extends _Component {
    constructor(args = {}) {
        if (args.components && args.components.walkable) {
            args = {...args, ...args.components.walkable};
        }
        super({...args, ...{type: "walkable"}});

        // Can walk on top of
        this.walkable = args.walkable || false;
    }

    save() {
        return {
            walkable: this.walkable
        }
    }
}