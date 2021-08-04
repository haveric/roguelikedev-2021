import _PositionalObject from "./_PositionalObject";
import * as THREE from "three";
import helvetikerFont from "../../../fonts/helvetiker_regular.typeface.json";
import Extend from "../../util/Extend";
import mplusCustomFont from "../../../fonts/mplus_custom.json";
import pressStartFont from "../../../fonts/Press Start 2P_Regular.json";

const cachedTextGeometries = [];
export default class CharacterObject extends _PositionalObject {
    constructor(args = {}) {
        const hasComponent = args.components && args.components.characterobject;
        if (hasComponent) {
             args.components.positionalobject = args.components.positionalobject || {};
             args.components.positionalobject = Extend.extend(args.components.characterobject, args.components.positionalobject);
        }

        super(Extend.extend(args, {type: "characterobject"}));

        this.fontName = "helvetiker";
        this.letter = '@';
        this.centered = true;

        if (hasComponent) {
            const characterobject = args.components.characterobject;
            this.fontName = characterobject.fontName || "helvetiker";
            this.letter = characterobject.letter || '@';
            if (characterobject.centered !== undefined) {
                this.centered = characterobject.centered;
            }
        }

        switch(this.fontName) {
            case "mplus":
                this.font = mplusCustomFont;
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
                    letter: this.letter,
                    centered: this.centered
                }
        });
    }

    createObject() {
        super.createObject();
        this.meshes = [];
        const newHeight = this.scale * this.depth;

        const font = new THREE.Font(this.font);
        let anyFound = false;
        for (const geometry of cachedTextGeometries) {
            const sameFont = geometry.parameters.options.font.data.familyName === font.data.familyName;
            if (sameFont && geometry.parameters.options.height === newHeight && geometry.letter === this.letter && geometry.centered === this.centered) {
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
            this.geometry.centered = this.centered;
            if (this.centered) {
                this.geometry.center();
            }

            cachedTextGeometries.push(this.geometry);
        }

        this.object = new THREE.Mesh(
            this.geometry,
            new THREE.MeshLambertMaterial({color: this.color})
        );
        this.object.originalColor = this.color;
        this.meshes.push(this.object);

        this.setTransparency();

        this.updateObjectPosition();
        this.object.parentEntity = this.parentEntity;
    }
}