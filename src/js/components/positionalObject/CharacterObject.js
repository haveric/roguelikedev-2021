import _PositionalObject from "./_PositionalObject";
import * as THREE from "three";
import Extend from "../../util/Extend";
import helvetikerFont from "../../../fonts/helvetiker_regular.typeface.json";
import mplusCustomFont from "../../../fonts/mplus_custom.json";
//import mplus from "../../../fonts/Rounded Mplus 1c_Regular.json";
import pressStartFont from "../../../fonts/Press Start 2P_Regular.json";

const cachedTextGeometries = [];
const fontCache = new Map();
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
                if (!fontCache.has(this.fontName)) {
                    fontCache.set(this.fontName, new THREE.Font(mplusCustomFont));
                }

                this.font = fontCache.get(this.fontName);
                break;
            case "helvetiker":
                if (!fontCache.has(this.fontName)) {
                    fontCache.set(this.fontName, new THREE.Font(helvetikerFont));
                }

                this.font = fontCache.get(this.fontName);
                break;
            case "pressStart":
            default:
                if (!fontCache.has(this.fontName)) {
                    fontCache.set(this.fontName, new THREE.Font(pressStartFont));
                }

                this.font = fontCache.get(this.fontName);
                break;
        }
    }

    save() {
        if (this.cachedSave) {
            return this.cachedSave;
        }

        let saveJson = {
            characterobject: {}
        };

        if (this.fontName !== "helvetiker") {
            saveJson.characterobject.fontName = this.fontName;
        }

        if (this.letter !== "@") {
            saveJson.characterobject.letter = this.letter;
        }

        if (this.centered !== true) {
            saveJson.characterobject.centered = this.centered;
        }

        this.cachedSave = Extend.deep(super.save(), saveJson);
        return this.cachedSave;
    }

    createObject() {
        super.createObject();
        this.meshes = [];
        const newHeight = this.scale * this.depth;
        const newSize = 4.1 / 5 * this.depth * this.size;

        let anyFound = false;
        for (const geometry of cachedTextGeometries) {
            const sameFont = geometry.cachedFamilyName === this.font.data.familyName;
            const sameSize = geometry.cachedSize === newSize;

            if (sameFont && sameSize && geometry.cachedHeight === newHeight && geometry.cachedLetter === this.letter && geometry.cachedCentered === this.centered) {
                this.geometry = geometry;
                anyFound = true;
                break;
            }
        }

        if (!anyFound) {
            this.geometry = new THREE.TextGeometry(this.letter, {
                font: this.font,
                size: newSize,
                height: newHeight,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: .05,
                bevelSize: .05,
                bevelOffset: 0,
                bevelSegments: 1
            });
            this.geometry.cachedFamilyName = this.font.data.familyName;
            this.geometry.cachedSize = newSize;
            this.geometry.cachedHeight = newHeight;
            this.geometry.cachedLetter = this.letter;
            this.geometry.cachedCentered = this.centered;
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