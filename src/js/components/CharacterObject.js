import _PositionalObject from "./_PositionalObject";
import * as THREE from "three";
import helvetikerFont from "../../fonts/helvetiker_regular.typeface.json";

export default class CharacterObject extends _PositionalObject {
    constructor(args = {}) {
        if (args.components && args.components.characterobject) {
            args = {...args, ...args.components.characterobject};
        }
        super({...args, ...{type: "characterobject"}});

        this.font = args.font || helvetikerFont;
        this.letter = args.letter || '@';
    }

    save() {
        return {
            ...super.save(),
            ...{
                letter: this.letter
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
            bevelSegments: 1
        });

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

    updateObjectPosition() {
        if (!this.hasObject()) {
            this.createObject();
        }
        this.object.position.set((this.x + this.xOffset) * this.width, (this.y + this.yOffset) * this.height, (this.z + this.zOffset) * this.depth);
    }
}