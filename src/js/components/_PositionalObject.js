import _Component from "./_Component";
import sceneState from "../SceneState";
import _Tile from "../entity/_Tile";

export default class _PositionalObject extends _Component {
    constructor(args = {}) {
        super({...args, ...{baseType: "positionalobject"}});

        this.x = args.x || 0;
        this.y = args.y || 0;
        this.z = args.z || 0;

        this.color = args.color || 0xffffff;
        this.object = null;
        this.highlighted = false;

        this.width = 5;
        this.height = 5;
        this.depth = 5;
        this.scale = args.scale || 1;
    }

    save() {
        if (this.parent && this.parent instanceof _Tile) {
            return {
                color: this.color,
                scale: this.scale
            }
        } else {
            return {
                x: this.x,
                y: this.y,
                z: this.z,
                color: this.color,
                scale: this.scale
            }
        }
    }

    createObject() { }

    teardown() {
        if (this.hasObject()) {
            sceneState.scene.remove(this.object);
            this.object = undefined;
        }
    }

    updateObjectPosition() {
        if (!this.hasObject()) {
            this.createObject();
        }

        this.object.position.set(this.x * this.width, this.y * this.height, (this.z * this.depth) - ((this.depth - (this.scale * this.depth)) / 2));
    }

    hasObject() {
        return this.object != null;
    }

    setVisible(visible) {
        if (!this.hasObject()) {
            this.createObject();
            sceneState.scene.add(this.object);
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