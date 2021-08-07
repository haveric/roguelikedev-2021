import _Component from "./_Component";
import Extend from "../util/Extend";

export default class Remnant extends _Component {
    constructor(args = {}) {
        super(Extend.extend(args, {baseType: "remnant"}));

        const hasComponent = args.components && args.components.remnant !== undefined;

        this.isRemnant = false;
        this.x = -1;
        this.y = -1;
        this.z = -1;

        if (hasComponent) {
            const remnant = args.components.remnant;
            if (remnant.isRemnant !== undefined) {
                this.isRemnant = remnant.isRemnant;
            }

            if (remnant.x !== undefined) {
                this.x = remnant.x;
            }

            if (remnant.y !== undefined) {
                this.y = remnant.y;
            }

            if (remnant.z !== undefined) {
                this.z = remnant.z;
            }
        }
    }

    save() {
        if (this.cachedSave) {
            return this.cachedSave;
        }

        let saveJson = {
            remnant: {}
        };

        if (this.isRemnant) {
            saveJson.remnant.isRemnant = this.isRemnant;
        }

        if (this.x !== -1) {
            saveJson.remnant.x = this.x;
        }

        if (this.y !== -1) {
            saveJson.remnant.y = this.y;
        }

        if (this.z !== -1) {
            saveJson.remnant.z = this.z;
        }

        this.cachedSave = saveJson;
        return saveJson;
    }
}