import _PositionalObject from "./_PositionalObject";
import * as THREE from "three";
import Extend from "../../util/Extend";

const cachedSolidGeometries = [];
export default class SolidObject extends _PositionalObject {
    constructor(args = {}) {
        const hasComponent = args.components && args.components.solidobject;
        if (hasComponent) {
            args.components.positionalobject = args.components.positionalobject || {};
            args.components.positionalobject = Extend.extend(args.components.positionalobject, args.components.solidobject);
        }
        super(Extend.extend(args, {type: "solidobject"}));
    }

    createObject() {
        this.meshes = [];
        const newDepth = this.scale * this.depth;

        let anyFound = false;
        for (const geometry of cachedSolidGeometries) {
            if (geometry.parameters.depth === newDepth) {
                this.geometry = geometry;
                anyFound = true;
                break;
            }
        }

        if (!anyFound) {
            this.geometry = new THREE.BoxBufferGeometry(this.width, this.height, newDepth);
            cachedSolidGeometries.push(this.geometry);
        }
        this.object = new THREE.Mesh(
            this.geometry,
            new THREE.MeshLambertMaterial({color: this.color})
        );
        this.object.originalColor = this.color;
        this.meshes.push(this.object);

        this.updateObjectPosition();
        this.object.rotateX(Math.PI * this.xRot);
        this.object.rotateY(Math.PI * this.yRot);
        this.object.rotateZ(Math.PI * this.zRot);
        this.object.parentEntity = this.parentEntity;
    }
}