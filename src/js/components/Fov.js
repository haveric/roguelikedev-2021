import _Component from "./_Component";

export default class Fov extends _Component{
    constructor(args = {}) {
        if (args.components && args.components.fov) {
            args = {...args, ...args.components.fov};
        }
        super({...args, ...{baseType: "fov"}});

        this.explored = args.explored || false;
        this.visible = args.visible || false;
    }

    save() {
        return {
            explored: this.explored
        }
    }
}