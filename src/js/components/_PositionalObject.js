import _Component from "./_Component";
import sceneState from "../SceneState";
import _Tile from "../entity/_Tile";
import Extend from "../util/Extend";
import {MathUtils} from "three";

export default class _PositionalObject extends _Component {
    constructor(args = {}) {
        super(Extend.extend(args, {baseType: "positionalobject"}));
        const hasComponent = args.components && args.components.positionalobject;

        this.object = null;
        this.meshes = [];
        this.highlighted = false;
        this.width = 5;
        this.height = 5;
        this.depth = 5;

        this.scale = 1;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.color = 0xffffff;
        this.xRot = 0;
        this.yRot = 0;
        this.zRot = 0;
        this.xOffset = 0;
        this.yOffset = 0;
        this.zOffset = 0;

        if (hasComponent) {
            this.x = args.components.positionalobject.x || 0;
            this.y = args.components.positionalobject.y || 0;
            this.z = args.components.positionalobject.z || 0;
            this.color = args.components.positionalobject.color || 0xffffff;
            this.scale = this.parseRand(args.components.positionalobject.scale, 1);
            this.xRot = this.parseRand(args.components.positionalobject.xRot, 0);
            this.yRot = this.parseRand(args.components.positionalobject.yRot, 0);
            this.zRot = this.parseRand(args.components.positionalobject.zRot, 0);
            this.xOffset = args.components.positionalobject.xOffset || 0;
            this.yOffset = args.components.positionalobject.yOffset || 0;
            this.zOffset = args.components.positionalobject.zOffset || 0;
            this.size = this.parseRand(args.components.positionalobject.size, 1);
        }
    }

    parseRand(value, defaultValue) {
        let returnValue;
        if (typeof value === "string") {
            if (value.indexOf(",") !== -1) {
                const valueSplit = value.split(",");
                returnValue = MathUtils.randFloat(parseFloat(valueSplit[0].trim()), parseFloat(valueSplit[1].trim())).toFixed(2);
            } else {
                returnValue = parseFloat(value) || defaultValue;
            }
        } else {
            returnValue = value || defaultValue;
        }

        return returnValue;
    }

    save() {
        if (this.parentEntity && this.parentEntity instanceof _Tile) {
            return {
                positionalobject: {
                    color: this.color,
                    scale: this.scale
                }
            }
        } else {
            return {
                positionalobject: {
                    x: this.x,
                    y: this.y,
                    z: this.z,
                    xRot: this.xRot,
                    yRot: this.yRot,
                    zRot: this.zRot,
                    xOffset: this.xOffset,
                    yOffset: this.yOffset,
                    zOffset: this.zOffset,
                    color: this.color,
                    scale: this.scale
                }
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

    resetColor() {
        for (const mesh of this.meshes) {
            mesh.material.color.set(mesh.originalColor);
        }
    }

    shiftColor(scalar) {
        for (const mesh of this.meshes) {
            mesh.material.transparent = true;
            mesh.material.color.multiplyScalar(scalar);
        }
    }

    setTransparency(opacity) {
        for (const mesh of this.meshes) {
            mesh.material.transparent = true;
            mesh.material.opacity = opacity;
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

    setVisible(visible = true) {
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
                this.shiftColor(2.5);
            }
            this.highlighted = true;
        }
    }

    removeHighlight() {
        if (this.highlighted) {
            if (this.hasObject()) {
                this.object.material.color.set(this.color);

                const parent = this.parentEntity;
                if (parent) {
                    const fov = parent.getComponent("fov");
                    if (fov && fov.explored && !fov.visible) {
                        this.shiftColor(.5);
                    }
                }
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