import _Component from "../components/_Component";
import componentLoader from "../components/ComponentLoader";
import Extend from "../util/Extend";

export default class _Entity {
    constructor(args) {
        this.type = args.type || "entity";
        this.id = args.id;
        this.name = args.name || "";
        this.description = args.description || "";
        this.componentArray = [];
        this.components = {};
        this.parent = null;
        this.combatTweens = [];

        if (args.components) {
            this.loadComponents(args, args.components);
        }

        this.cachedSave = null;
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

        this.clearSaveCache();
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
            if (component.baseType === baseType) {
                const index = this.componentArray.indexOf(component);
                this.componentArray.splice(index, 1);
                break;
            }
        }

        this.clearSaveCache();
    }

    clearSaveCache() {
        this.cachedSave = null;
    }

    save() {
        if (this.cachedSave !== null) {
            return this.cachedSave;
        }

        let json = {
            id: this.id,
            type: this.type,
            name: this.name,
            description: this.description
        };

        json.components = {};
        for (const component of this.componentArray) {
            const save = component.save();
            if (save !== null && save !== {}) {
                Extend.deep(json.components, save);
            }
        }

        this.cachedSave = json;
        return json;
    }

    /**
     * @returns {_Entity}
     */
    clone() {
        console.error("Not implemented");
    }

    callEvent(event, args) {
        for (const component of this.componentArray) {
            if (component[event]) {
                component[event](args);
            }
        }

        if (this[event]) {
            this[event](args);
        }
    }

    getComponentDescriptions() {
        let description = "";
        for (const component of this.componentArray) {
            description += component.getDescription();
        }

        return description;
    }

    stopCombatAnimations() {
        for (const tween of this.combatTweens) {
            tween.stop();
        }

        const position = this.getComponent("positionalobject");
        if (position) {
            position.updateObjectPosition();
        }
    }

    setName(newName) {
        this.name = newName;
        this.clearSaveCache();
    }

    onEntityDeath() {
        this.setName("Remains of " + this.name);
    }
}