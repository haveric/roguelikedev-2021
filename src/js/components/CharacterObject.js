import _PositionalObject from "./_PositionalObject";
import * as THREE from "three";
import helvetikerFont from "../../fonts/helvetiker_regular.typeface.json";

export default class CharacterObject extends _PositionalObject {
    constructor(x, y, z, scale, font, letter, color, xRot, yRot) {
        super("characterobject", x, y, z, scale, color);

        this.font = font || helvetikerFont;
        this.letter = letter || '@';
        this.xRot = xRot || 0;
        this.yRot = yRot || 0;
    }

    createObject() {
        const font = new THREE.Font(this.font);
        this.geometry = new THREE.TextGeometry(this.letter, {
            font: font,
            size: 3.5/5 * this.depth,
            height: this.scale * this.depth,
            curveSegments: 24,
            bevelEnabled: true,
            bevelThickness: .05,
            bevelSize: .05,
            bevelOffset: 0,
            bevelSegments: 5
        });

        this.object = new THREE.Mesh(
            this.geometry,
            new THREE.MeshLambertMaterial({color: this.color})
        );

        this.updateObjectPosition();
        this.object.rotateX(Math.PI * this.xRot);
        this.object.rotateY(Math.PI * this.yRot);

        this.object.parentEntity = this.parentEntity;
    }

    updateObjectPosition() {
        this.object.position.set((this.x-.4) * this.width, (this.y-.3) * this.height, (this.z * this.depth) - ((this.depth - this.scale) / 2));
    }
}