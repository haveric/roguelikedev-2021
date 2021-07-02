import _PositionalObject from "./_PositionalObject";
import * as THREE from "three";
import helvetikerFont from "../../fonts/helvetiker_regular.typeface.json";

export default class CharacterObject extends _PositionalObject {
    constructor(x, y, z, scale, font, letter, color, options) {
        super("characterobject", x, y, z, scale, color);

        this.font = font || helvetikerFont;
        this.letter = letter || '@';

        this.xRot = 0;
        this.yRot = 0;
        this.xOffset = 0;
        this.yOffset = 0;
        this.zOffset = 0;
        if (options) {
            if (options.xRot) {
                this.xRot = options.xRot;
            }
            if (options.yRot) {
                this.yRot = options.yRot;
            }
            if (options.xOffset) {
                this.xOffset = options.xOffset;
            }
            if (options.yOffset) {
                this.yOffset = options.yOffset;
            }
            if (options.zOffset) {
                this.zOffset = options.zOffset;
            }
        }
    }

    createObject() {
        const font = new THREE.Font(this.font);
        this.geometry = new THREE.TextGeometry(this.letter, {
            font: font,
            size: 4.1/5 * this.depth,
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
        this.object.position.set((this.x + this.xOffset) * this.width, (this.y + this.yOffset) * this.height, (this.z + this.zOffset) * this.depth);
    }
}