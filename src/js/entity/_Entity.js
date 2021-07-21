import _Component from "../components/_Component";
import componentLoader from "../components/ComponentLoader";
import Extend from "../util/Extend";

export default class _Entity {
    constructor(args) {
        this.type = args.type || "entity";
        this.name = args.name;
        this.componentArray = [];
        this.components = {};

        if (args.components) {
            this.loadComponents(args, args.components);
        }
    }

    loadComponents(args, components) {
        const self = this;
        Object.keys(components).forEach(function(key) {
            const type = componentLoader.types.get(key)
            if (type) {
                const baseType = type.baseType;
                const existingComponent = self.getComponent(baseType);
                if (!existingComponent) {
                    self.setComponent(componentLoader.create(this, key, args));
                }
            }
        });
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
                Extend.deep(json.components, save);
            }
        }

        return json;
    }

    clone() {
        return new _Entity(this.save());
    }

    stopAnimations() {
        if (this.tweenAttack) {
            this.tweenAttack.stop();
        }

        if (this.tweenReturn) {
            this.tweenReturn.stop();
        }
    }
}