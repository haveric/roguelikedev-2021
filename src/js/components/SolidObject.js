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
        this.object.rotateX(Math.PI * this.xRot);
        this.object.rotateY(Math.PI * this.yRot);
        this.object.rotateZ(Math.PI * this.zRot);
        this.object.parentEntity = this.parentEntity;
    }
}