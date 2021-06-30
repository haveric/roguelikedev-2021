export default class _Component {
    constructor(baseType, type) {
        this.baseType = baseType || "component";
        this.type = type || this.baseType;
    }
}