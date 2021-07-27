export default class FovSlope {
    constructor(y, x) {
        this.y = y;
        this.x = x;
    }

    greater(y, x) {
        return this.y * x > this.x * y;
    }

    greaterOrEqual(y, x) {
        return this.y * x >= this.x * y;
    }
/*
    less(y, x) {
        return this.y * x < this.x * y;
    }
*/
    lessOrEqual(y, x) {
        return this.y * x <= this.x * y;
    }
}