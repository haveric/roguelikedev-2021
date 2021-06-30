import _PositionalObject from "./_PositionalObject";
import * as THREE from "three";
import {TWEEN} from "three/examples/jsm/libs/tween.module.min";

export default class SolidObject extends _PositionalObject {
    constructor(x, y, z, scale, color) {
        super("solidobject", x, y, z, scale, color);
    }

    createObject() {
        this.geometry = new THREE.BoxBufferGeometry(this.width, this.height, this.scale * this.depth);
        this.object = new THREE.Mesh(
            this.geometry,
            new THREE.MeshLambertMaterial({color: this.color})
        );

        this.updateObjectPosition();
        this.object.parentEntity = this.parentEntity;
    }


}