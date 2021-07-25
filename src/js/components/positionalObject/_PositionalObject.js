import _Component from "../_Component";
import sceneState from "../../SceneState";
import _Tile from "../../entity/_Tile";
import Extend from "../../util/Extend";
import {MathUtils, Vector3} from "three";
import {TWEEN} from "three/examples/jsm/libs/tween.module.min";
import engine from "../../Engine";

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
        this.opacity = 1;
        this.xRot = 0;
        this.yRot = 0;
        this.zRot = 0;
        this.xOffset = 0;
        this.yOffset = 0;
        this.zOffset = 0;

        this.deathAnimation = null;

        if (hasComponent) {
            const positionalobject = args.components.positionalobject;
            this.x = positionalobject.x || 0;
            this.y = positionalobject.y || 0;
            this.z = positionalobject.z || 0;
            this.color = positionalobject.color || 0xffffff;
            if (positionalobject.opacity !== undefined) {
                this.opacity = positionalobject.opacity;
            }

            this.scale = this.parseRand(positionalobject.scale, 1);
            this.xRot = this.parseRand(positionalobject.xRot, 0);
            this.yRot = this.parseRand(positionalobject.yRot, 0);
            this.zRot = this.parseRand(positionalobject.zRot, 0);

            this.xOffset = this.parseRand(positionalobject.xOffset, 0);
            this.yOffset = this.parseRand(positionalobject.yOffset, 0);
            this.zOffset = this.parseRand(positionalobject.zOffset, 0);
            this.size = this.parseRand(positionalobject.size, 1);
        }

        this.transparency = 1; // for quick reference on mousemove
    }

    parseRand(value, defaultValue) {
        let returnValue;
        if (typeof value === "string") {
            if (value.indexOf(",") !== -1) {
                const valueSplit = value.split(",");
                returnValue = parseFloat(MathUtils.randFloat(parseFloat(valueSplit[0].trim()), parseFloat(valueSplit[1].trim())).toFixed(2));
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
                    opacity: this.opacity,
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
                    opacity: this.opacity,
                    scale: this.scale
                }
            }
        }
    }

    createObject() { }

    teardown() {
        if (this.deathAnimation) {
            this.deathAnimation.stop();
        }

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

    setTransparency(opacity = 1) {
        this.transparency = opacity;

        const actualOpacity = opacity * this.opacity;
        for (const mesh of this.meshes) {
            if (actualOpacity < 1) {
                mesh.material.transparent = true;
            } else {
                mesh.material.transparent = false;
            }
            mesh.material.opacity = actualOpacity;
        }
    }

    getObjectPosition() {
        return new Vector3(this.x * this.width, this.y * this.height, (this.z * this.depth) - ((this.depth - (this.scale * this.depth)) / 2));
    }

    updateObjectPosition() {
        if (this.hasObject()) {
            this.object.position.set(this.x * this.width, this.y * this.height, (this.z * this.depth) - ((this.depth - (this.scale * this.depth)) / 2));
        }
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
        this.parentEntity.callEvent("onEntityMove");
        this.x += x;
        this.y += y;
        this.z += z;

        this.updateObjectPosition();
    }

    /**
     *
     * @param {_PositionalObject} other
     */
    distance(other) {
        return Math.abs(this.x - other.x) + Math.abs(this.y - other.y) + Math.abs(this.z - other.z);
    }

    /**
     *
     * @param {_PositionalObject} other
     */
    horizontalDistance(other) {
        return Math.max(Math.abs(this.x - other.x), Math.abs(this.y - other.y));
    }

    /**
     *
     * @param {_PositionalObject} other
     */
    isSamePosition(other) {
        if (!other) {
            return false;
        }

        return this.x === other.x && this.y === other.y && this.z === other.z;
    }

    onEntityDeath() {
        const self = this;
        const rotation = {
            xRot: this.xRot,
            yRot: this.yRot,
            zRot: this.zRot,
            zOffset: this.zOffset
        }
        const finalRotation = {
            xRot: 0,
            yRot: 0,
            zRot: Math.random() * 2,
            zOffset: 0
        };

        this.deathAnimation = new TWEEN.Tween(rotation).to(finalRotation, 200);
        this.deathAnimation.onUpdate(function () {
            self.xRot = rotation.xRot;
            self.yRot = rotation.yRot;
            self.zRot = rotation.zRot;
            self.zOffset = rotation.zOffset;
            self.updateObjectPosition();
            engine.needsMapUpdate = true;
        });
        this.deathAnimation.start();
    }
}