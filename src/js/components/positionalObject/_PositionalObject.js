import _Component from "../_Component";
import sceneState from "../../SceneState";
import _Tile from "../../entity/_Tile";
import Extend from "../../util/Extend";
import {Vector3} from "three";
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
        this.color = "#ffffff";
        this.opacity = 1;
        this.xRot = 0;
        this.yRot = 0;
        this.zRot = 0;
        this.xOffset = 0;
        this.yOffset = 0;
        this.zOffset = 0;
        this.size = 1;
        this.actorZOffset = 0;

        this.deathAnimation = null;

        if (hasComponent) {
            const positionalobject = args.components.positionalobject;
            this.x = positionalobject.x || 0;
            this.y = positionalobject.y || 0;
            this.z = positionalobject.z || 0;
            this.color = positionalobject.color || "#ffffff";
            if (positionalobject.opacity !== undefined) {
                this.opacity = positionalobject.opacity;
            }

            this.scale = this.parseRandFloat(positionalobject.scale, 1);
            this.xRot = this.parseRandFloat(positionalobject.xRot, 0);
            this.yRot = this.parseRandFloat(positionalobject.yRot, 0);
            this.zRot = this.parseRandFloat(positionalobject.zRot, 0);

            this.xOffset = this.parseRandFloat(positionalobject.xOffset, 0);
            this.yOffset = this.parseRandFloat(positionalobject.yOffset, 0);
            this.zOffset = this.parseRandFloat(positionalobject.zOffset, 0);
            this.size = this.parseRandFloat(positionalobject.size, 1);
            this.actorZOffset = this.parseRandFloat(positionalobject.actorZOffset, 0);
        }

        this.transparency = 1; // for quick reference on mousemove
    }

    save() {
        if (this.cachedSave) {
            return this.cachedSave;
        }

        let saveJson = {
            positionalobject: {}
        }
        if (this.parentEntity && this.parentEntity instanceof _Tile) {
            if (this.actorZOffset !== 0) {
                saveJson.positionalobject.actorZOffset = this.actorZOffset;
            }
        } else {
            saveJson.positionalobject.x = this.x;
            saveJson.positionalobject.y = this.y;
            saveJson.positionalobject.z = this.z;
        }

        if (this.xRot !== 0) {
            saveJson.positionalobject.xRot = this.xRot;
        }

        if (this.yRot !== 0) {
            saveJson.positionalobject.yRot = this.yRot;
        }

        if (this.zRot !== 0) {
            saveJson.positionalobject.zRot = this.zRot;
        }

        if (this.xOffset !== 0) {
            saveJson.positionalobject.xOffset = this.xOffset;
        }

        if (this.yOffset !== 0) {
            saveJson.positionalobject.yOffset = this.yOffset;
        }

        if (this.zOffset !== 0) {
            saveJson.positionalobject.zOffset = this.zOffset;
        }

        if (this.color !== "#ffffff") {
            saveJson.positionalobject.color = this.color;
        }

        if (this.opacity !== 1) {
            saveJson.positionalobject.opacity = this.opacity;
        }

        if (this.scale !== 1) {
            saveJson.positionalobject.scale = this.scale;
        }

        if (this.size !== 1) {
            saveJson.positionalobject.size = this.size;
        }

        this.cachedSave = saveJson;
        return saveJson;
    }

    createObject() {}

    teardown() {
        if (this.deathAnimation) {
            this.deathAnimation.stop();
        }

        if (this.hasObject()) {
            sceneState.scene.remove(this.object);
        }

        this.object = undefined;
        this.meshes = [];
    }

    onMapTeardown() {
        this.teardown();
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
            mesh.material.transparent = actualOpacity < 1;
            mesh.material.opacity = actualOpacity;
        }
    }

    getObjectPosition() {
        return new Vector3((this.x + this.xOffset) * this.width, (this.y + this.yOffset) * this.height, (this.z + this.zOffset) * this.depth - ((this.depth - (this.scale * this.depth)) / 2));
    }

    updateObjectPosition() {
        if (this.hasObject()) {
            let zOffset = this.zOffset;
            if (this.parentEntity.type === "actor" || this.parentEntity.type === "item") {
                const tile = engine.gameMap.tiles.get(this.z)[this.x][this.y];
                if (tile) {
                    const position = tile.getComponent("positionalobject");
                    zOffset += position.actorZOffset;
                }
            }

            this.object.position.set((this.x + this.xOffset) * this.width, (this.y + this.yOffset) * this.height, (this.z + zOffset) * this.depth - ((this.depth - (this.scale * this.depth)) / 2));
            this.object.rotation.set(Math.PI * this.xRot, Math.PI * this.yRot, Math.PI * this.zRot);
        }
    }

    hasObject() {
        return this.object != null;
    }

    setVisible(visible = true) {
        if (visible && !this.hasObject()) {
            this.createObject();
            sceneState.scene.add(this.object);
        }

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

        this.clearSaveCache();
        this.updateObjectPosition();

        this.parentEntity.callEvent("onEntityMove");
    }

    /**
     *
     * @param x
     * @param y
     * @param z
     * @param callEvent Set to false when this is being called from the parent entity to prevent infinite calls
     */
    moveTo(x, y = this.y, z = this.z, callEvent = true) {
        this.x = x;
        this.y = y;
        this.z = z;

        this.clearSaveCache();
        this.updateObjectPosition();

        if (callEvent) {
            this.parentEntity.callEvent("onEntityMove");
        }
    }

    updateRotation(xRot, yRot = this.yRot, zRot = this.zRot) {
        this.xRot = xRot;
        this.yRot = yRot;
        this.zRot = zRot;
        this.clearSaveCache();
    }

    updateOffsets(xOffset, yOffset = this.yOffset, zOffset = this.zOffset) {
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.zOffset = zOffset;
        this.clearSaveCache();
    }

    updateZOffset(zOffset) {
        this.zOffset = zOffset;
        this.clearSaveCache();
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
            self.updateRotation(rotation.xRot, rotation.yRot, rotation.zRot);
            self.updateZOffset(rotation.zOffset);
            self.updateObjectPosition();
            engine.needsMapUpdate = true;
        });
        this.deathAnimation.start();
    }
}