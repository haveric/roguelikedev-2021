import _PositionalObject from "./_PositionalObject";
import * as THREE from "three";

export default class SolidObject extends _PositionalObject {
    constructor(args = {}) {
        if (args.components && args.components.solidobject) {
            args = {...args, ...args.components.solidobject};
        }
        super({...args, ...{type: "solidobject"}});
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