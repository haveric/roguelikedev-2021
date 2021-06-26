import * as THREE from "three";
import Entity from "./Entity";
import helvetiker from "../../fonts/helvetiker_regular.typeface.json";
import sceneState from "../SceneState";

export default class Character extends Entity {
    constructor(x, y, z, color, letter) {
        super(x, y, z);

        this.maxScaleZ = .5;
        this.color = color || 0xffffff;
        this.letter = letter || '@';

        const font = new THREE.Font(helvetiker);
        this.geometry = new THREE.TextGeometry(this.letter, {
            font: font,
            size: 4,
            height: .5,
            curveSegments: 24,
            bevelEnabled: true,
            bevelThickness: .05,
            bevelSize: .05,
            bevelOffset: 0,
            bevelSegments: 5
        });
    }

    createObject() {
        this.object = new THREE.Mesh(
            this.geometry,
            new THREE.MeshLambertMaterial({color: this.color})
        );

        this.scaleZ = .5;
        this.object.position.set(this.x * this.width, this.y * this.height, this.z + this.scaleZ)

        this.object.rotateX(Math.PI * .5);
        this.object.rotateY(Math.PI * .25);

        this.updateZ();

        console.log(this.object);
        this.object.parentEntity = this;
    }

    setVisible(visible) {
        if (!this.object) {
            this.createObject();
        }

        super.setVisible(visible);
    }

    updateZ() {
        if (this.hasObject()) {
            this.object.scale.z = this.scaleZ;
            this.object.position.z = (this.z * this.depth) - (1 - this.scaleZ) * (this.depth / 2);
        }
    }

    updatePosition() {
        this.object.position.set(this.x * this.width, this.y * this.height, this.z + this.scaleZ)
    }
}