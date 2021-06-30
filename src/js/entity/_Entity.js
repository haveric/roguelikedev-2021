import _Component from "../components/_Component";

export default class _Entity {
    constructor(type, name) {
        this.type = type || "entity";
        this.name = name;
        this.components = {};
    }

    setComponent(component) {
        if (!(component instanceof _Component)) {
            console.error("Invalid component: ", component);
        }

        component.parentEntity = this;
        this.components[component.baseType] = component;
    }

    getComponent(baseType) {
        return this.components[baseType];
    }

    removeComponent(baseType) {
        if (!this.components[baseType]) {
            return;
        }

        this.components[baseType] = undefined;
    }
}