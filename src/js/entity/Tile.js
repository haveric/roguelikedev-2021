import * as THREE from "three";
import Entity from "./Entity";

export default class Tile extends Entity {
    constructor(x, y, z, color) {
        super(x, y, z);

        this.color = color || 0x333333;
        this.tile = new THREE.Group();
        this.cube = new THREE.Mesh(
            new THREE.BoxBufferGeometry(this.width, this.height, this.depth),
            new THREE.MeshLambertMaterial({color: this.color})
        );

        this.tile.receiveShadow = true;

        this.tile.position.set(this.x * this.width, this.y * this.height, this.z + this.scaleZ)
        this.updateZ(0);
        this.tile.add(this.cube);
    }

    updateZ(increment) {
        if (increment >= 0) {
            if (this.scaleZ < this.maxScaleZ) {
                let left = (this.maxScaleZ - this.scaleZ) / 2;
                this.scaleZ += increment * left;
                if (this.scaleZ > this.maxScaleZ) {
                    this.scaleZ = this.maxScaleZ;
                }

                this.cube.scale.z = this.scaleZ;
                this.tile.position.z = (this.z * this.depth) -(1 - this.scaleZ) * (this.depth / 2);
            }
        }
    }
}