import * as THREE from "three";
import Entity from "./Entity";

export default class Tile extends Entity {
    constructor(x, y, z, color, maxScaleZ) {
        super(x, y, z);
        this.maxScaleZ = maxScaleZ || 1;
        this.scaleZ = this.maxScaleZ;
        this.color = color || 0x333333;
        this.highlighted = false;
    }

    createObject() {
        this.object = new THREE.Mesh(
            new THREE.BoxBufferGeometry(this.width, this.height, this.depth),
            new THREE.MeshLambertMaterial({color: this.color})
        );

        this.object.position.set(this.x * this.width, this.y * this.height, this.z + this.scaleZ)
        this.updateZ(0, true);
        this.object.parentEntity = this;
    }

    highlight() {
        if (!this.highlighted) {
            this.object.material.color.set(0xffffff);
            this.highlighted = true;
        }
    }

    unhighlight() {
        if (this.highlighted) {
            this.object.material.color.set(this.color);
            this.highlighted = false;
        }
    }

    setVisible(visible) {
        if (!this.object) {
            this.createObject();
        }
        if (visible) {
            this.resetZ();
        }

        super.setVisible(visible);
    }

    resetZ() {
        this.scaleZ = 0;
    }

    updateZ(increment, force) {
        if (increment >= 0) {
            if (force || this.scaleZ < this.maxScaleZ) {
                this.scaleZ += increment;
                if (this.scaleZ > this.maxScaleZ) {
                    this.scaleZ = this.maxScaleZ;
                }

                this.object.scale.z = this.scaleZ;
                this.object.position.z = (this.z * this.depth) -(1 - this.scaleZ) * (this.depth / 2);
            } else {
                return true;
            }
        }

        return false;
    }
}