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
        this.tile = new THREE.Group();


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

        this.mesh = new THREE.Mesh(
            this.geometry,
            new THREE.MeshLambertMaterial({color: this.color})
        );

        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        this.scaleZ = .5;
        this.tile.position.set(this.x * this.width, this.y * this.height, this.z + this.scaleZ)

        this.tile.rotateX(Math.PI * .5);
        this.tile.rotateY(Math.PI * .25);

        this.updateZ();
        this.tile.add(this.mesh);
    }

    setVisible(visible) {
        if (visible && !this.tile.visible) {
            this.tile.visible = true;
        } else if (!visible && this.tile.visible) {
            this.tile.visible = false;
        }
    }

    updateZ() {
        if (this.mesh) {
            this.mesh.scale.z = this.scaleZ;
            this.tile.position.z = (this.z * this.depth) - (1 - this.scaleZ) * (this.depth / 2);
        }
    }

    updatePosition() {
        this.tile.position.set(this.x * this.width, this.y * this.height, this.z + this.scaleZ)
    }
}