import _Component from "./_Component";

export default class _PositionalObject extends _Component {
    constructor(type, x, y, z, scale, color) {
        super("positionalobject", type);

        this.x = x;
        this.y = y;
        this.z = z;

        this.color = color || 0xffffff;
        this.object = null;
        this.highlighted = false;

        this.width = 5;
        this.height = 5;
        this.depth = 5;
        this.scale = scale || 1;
    }

    createObject() { }

    updateObjectPosition() {
        this.object.position.set(this.x * this.width, this.y * this.height, (this.z * this.depth) - ((this.depth - (this.scale * this.depth)) / 2));
    }

    hasObject() {
        return this.object != null;
    }

    setVisible(visible) {
        if (!this.hasObject()) {
            this.createObject();
        }

        if (visible && !this.object.visible) {
            this.object.visible = true;
        } else if (!visible && this.object.visible) {
            this.object.visible = false;
        }
    }

    isVisible() {
        return this.hasObject() && this.object.visible;
    }

    highlight() {
        if (!this.highlighted) {
            if (this.hasObject()) {
                this.object.material.color.set(0xffffff);
            }
            this.highlighted = true;
        }
    }

    removeHighlight() {
        if (this.highlighted) {
            if (this.hasObject()) {
                this.object.material.color.set(this.color);
            }
            this.highlighted = false;
        }
    }

    move(x, y = 0, z = 0) {
        this.x += x;
        this.y += y;
        this.z += z;

        this.updateObjectPosition();
    }

}