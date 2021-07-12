export default class _Component {
    constructor(args = {}) {
        this.baseType = args.baseType || "component";
        this.type = args.type || this.baseType;
        this.parentEntity = args.parentEntity;
    }

    save() {
        return null;
    }
}