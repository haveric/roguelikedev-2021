export default class Entity {
    constructor(x, y, z) {
        this.width = 5;
        this.height = 5;
        this.depth = 5;
        this.x = x;
        this.y = y;
        this.z = z;
        this.scaleZ = 0.1;
        this.maxScaleZ = 1;
    }
}