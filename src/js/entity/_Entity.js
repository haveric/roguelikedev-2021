import _Component from "../components/_Component";

export default class _Entity {
    constructor(args) {
        this.type = args.type || "entity";
        this.name = args.name;
        this.componentArray = [];
        this.components = {};
    }

    setComponent(component) {
        if (!(component instanceof _Component)) {
            console.error("Invalid component: ", component);
        }

        component.parentEntity = this;
        this.components[component.baseType] = component;
        this.componentArray.push(component);
    }

    getComponent(baseType) {
        return this.components[baseType];
    }

    removeComponent(baseType) {
        if (!this.components[baseType]) {
            return;
        }

        this.components[baseType] = undefined;
        for (const component of this.componentArray) {
            if (component.type === baseType) {
                const index = this.componentArray.indexOf(component);
                this.componentArray.splice(index, 1);
                break;
            }
        }
    }

    save() {
        let json = {
            type: this.type,
            name: this.name,
        };

        json.components = {};
        for (const component of this.componentArray) {
            const save = component.save();
            if (save !== null) {
                json.components[component.type] = save;
            }
        }

        return json;
    }
}