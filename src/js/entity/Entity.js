export default class Entity {
    constructor(x, y, z) {
        this.width = 5;
        this.height = 5;
        this.depth = 5;
        this.x = x;
        this.y = y;
        this.z = z;

        this.object = null;
    }

    hasObject() {
        return this.object != null;
    }

    setVisible(visible) {
        if (this.hasObject()) {
            if (visible && !this.object.visible) {
                this.object.visible = true;
            } else if (!visible && this.object.visible) {
                this.object.visible = false;
            }
        }
    }

    isVisible() {
        return this.hasObject() && this.object.visible;
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