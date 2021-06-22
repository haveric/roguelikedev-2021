export default class Entity {
    constructor(x, y, z) {
        this.width = 5;
        this.height = 5;
        this.depth = 5;
        this.x = x;
        this.y = y;
        this.z = z;
    }

    moveLeft() {
        this.x -= 1;
    }

    moveRight() {
        this.x += 1;
    }

    moveUp() {
        this.y += 1;
    }

    moveDown() {
        this.y -= 1;
    }
}