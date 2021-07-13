import _PositionalObject from "./_PositionalObject";
import * as THREE from "three";
import helvetikerFont from "../../fonts/helvetiker_regular.typeface.json";
import Extend from "../util/Extend";
import mplusFont from "../../fonts/Rounded Mplus 1c_Regular.json";
import jetbrainsMonoFont from "../../fonts/JetBrains Mono_Regular.json";
import pressStartFont from "../../fonts/Press Start 2P_Regular.json";

const cachedTextGeometries = [];
export default class CharacterObject extends _PositionalObject {
    constructor(args = {}) {
        const hasComponent = args.components && args.components.characterobject;
        if (hasComponent) {
             args.components.positionalobject = args.components.positionalobject || {};
             args.components.positionalobject = Extend.extend(args.components.positionalobject, args.components.characterobject);
        }

        super(Extend.extend(args, {type: "characterobject"}));

        this.fontName = "helvetiker";
        this.letter = '@';

        if (hasComponent) {
            this.fontName = args.components.characterobject.fontName || "helvetiker";
            this.letter = args.components.characterobject.letter || '@';
        }

        switch(this.fontName) {
            case "mplus":
                this.font = mplusFont;
                break;
            case "jetbrains":
                this.font = jetbrainsMonoFont;
                break;
            case "helvetiker":
                this.font = helvetikerFont;
                break;
            case "pressStart":
            default:
                this.font = pressStartFont;
                break;
        }
    }

    save() {
        return Extend.deep(super.save(), {
            characterobject:
                {
                    fontName: this.fontName,
                    letter: this.letter
                }
        });
    }

    createObject() {
        this.meshes = [];
        const newHeight = this.scale * this.depth;

        const font = new THREE.Font(this.font);
        let anyFound = false;
        for (const geometry of cachedTextGeometries) {
            if (geometry.parameters.options.font.data.familyName === font.data.familyName && geometry.parameters.options.height === newHeight && geometry.letter === this.letter) {
                this.geometry = geometry;
                anyFound = true;
                break;
            }
        }

        if (!anyFound) {
            this.geometry = new THREE.TextGeometry(this.letter, {
                font: font,
                size: 4.1 / 5 * this.depth * this.size,
                height: newHeight,
                curveSegments: 24,
                bevelEnabled: true,
                bevelThickness: .05,
                bevelSize: .05,
                bevelOffset: 0,
                bevelSegments: 1
            });
            this.geometry.letter = this.letter;
            cachedTextGeometries.push(this.geometry);
        }

        this.object = new THREE.Mesh(
            this.geometry,
            new THREE.MeshLambertMaterial({color: this.color})
        );
        this.object.originalColor = this.color;
        this.meshes.push(this.object);

        this.geometry.center();

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
        this.object.position.set((this.x + this.xOffset) * this.width, (this.y + this.yOffset) * this.height, (this.z + this.zOffset) * this.depth - ((this.depth - (this.scale * this.depth)) / 2));
        //this.object.position.set((this.x + this.xOffset) * this.width, (this.y + this.yOffset) * this.height, (this.z + this.zOffset) * this.depth);
    }
}