import _Component from "./_Component";

export default class Fov extends _Component {
    constructor(args = {}) {
        super(args, "fov");
        const hasComponent = args.components && args.components.fov;

        this.explored = false;
        this.visible = false;

        if (hasComponent) {
            this.explored = args.components.fov.explored || false;
        }
    }

    save() {
        if (this.cachedSave) {
            return this.cachedSave;
        }

        let saveJson;
        if (this.explored) {
            saveJson = {
                fov: {
                    explored: this.explored
                }
            };
        } else {
            saveJson = {};
        }

        this.cachedSave = saveJson;
        return saveJson;
    }

    setExplored(explored) {
        this.explored = explored;
        this.clearSaveCache();
    }

    setVisible(visible) {
        this.visible = visible;
    }
}