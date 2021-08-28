import _PositionalObject from "./_PositionalObject";
import * as THREE from "three";
import Extend from "../../util/Extend";
import helvetikerFont from "../../../fonts/helvetiker_regular.typeface.json";
import jetbrainsFont from "../../../fonts/JetBrains Mono_Regular.json";
import mplusCustomFont from "../../../fonts/mplus_custom.json";
//import mplus from "../../../fonts/Rounded Mplus 1c_Regular.json";
import pressStartFont from "../../../fonts/Press Start 2P_Regular.json";
import {TWEEN} from "three/examples/jsm/libs/tween.module.min";
import engine from "../../Engine";

const cachedTextGeometries = [];
const fontCache = new Map();
export default class CharacterObject extends _PositionalObject {
    constructor(args = {}) {
        const hasComponent = args.components && args.components.characterobject;
        if (hasComponent) {
            args.components.positionalobject = args.components.positionalobject || {};
            args.components.positionalobject = Extend.extend(args.components.characterobject, args.components.positionalobject);
        }

        super(args, "characterobject");

        this.fontName = "helvetiker";
        this.letter = "@";
        this.centered = true;
        this.characters = [];

        if (hasComponent) {
            const characterobject = args.components.characterobject;
            this.fontName = characterobject.fontName || "helvetiker";
            this.letter = characterobject.letter || "@";
            if (characterobject.centered !== undefined) {
                this.centered = characterobject.centered;
            }

            if (characterobject.characters !== undefined) {
                this.characters = characterobject.characters;
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
            case "jetbrains":
                if (!fontCache.has(this.fontName)) {
                    fontCache.set(this.fontName, new THREE.Font(jetbrainsFont));
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

        const characterObject = {};

        if (this.fontName !== "helvetiker") {
            characterObject.fontName = this.fontName;
        }

        if (this.letter !== "@") {
            characterObject.letter = this.letter;
        }

        if (this.centered !== true) {
            characterObject.centered = this.centered;
        }

        if (this.characters.length > 0) {
            characterObject.characters = JSON.stringify(this.characters);
        }

        const saveJson = super.save();
        saveJson.characterobject = characterObject;

        this.cachedSave = saveJson;
        return this.cachedSave;
    }

    createObject() {
        super.createObject();
        this.meshes = [];

        if (this.characters.length > 0) {
            this.object = new THREE.Group();
            this.object.originalColor = this.color;

            for (const character of this.characters) {
                const letter = character.letter || this.letter;
                const color = character.color || this.color;
                let scale;
                if (character.scale !== undefined) {
                    scale = character.scale;
                } else {
                    scale = this.scale;
                }

                let depth;
                if (character.depth !== undefined) {
                    depth = character.depth;
                } else {
                    depth = this.depth;
                }

                let size;
                if (character.size !== undefined) {
                    size = character.size;
                } else {
                    size = this.size;
                }

                let font;
                if (character.fontName) {
                    font = fontCache.get(character.fontName);
                } else {
                    font = this.font;
                }

                this.object.add(this.createMesh(scale, depth, size, font, letter, color, character));
            }
        } else {
            this.object = this.createMesh(this.scale, this.depth, this.size, this.font, this.letter, this.color);
        }

        this.setTransparency();

        this.updateObjectPosition();
    }

    createMesh(scale, depth, size, font, letter, color, options) {
        const newHeight = scale * depth;
        const newSize = 4.1 / 5 * depth * size;

        let anyFound = false;
        for (const geometry of cachedTextGeometries) {
            const sameFont = geometry.cachedFamilyName === font.data.familyName;
            const sameSize = geometry.cachedSize === newSize;

            if (sameFont && sameSize && geometry.cachedHeight === newHeight && geometry.cachedLetter === letter && geometry.cachedCentered === this.centered) {
                this.geometry = geometry;
                anyFound = true;
                break;
            }
        }

        if (!anyFound) {
            this.geometry = new THREE.TextGeometry(letter, {
                font: font,
                size: newSize,
                height: newHeight,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: .05,
                bevelSize: .05,
                bevelOffset: 0,
                bevelSegments: 1
            });
            this.geometry.cachedFamilyName = font.data.familyName;
            this.geometry.cachedSize = newSize;
            this.geometry.cachedHeight = newHeight;
            this.geometry.cachedLetter = letter;
            this.geometry.cachedCentered = this.centered;
            if (this.centered) {
                this.geometry.center();
            }

            cachedTextGeometries.push(this.geometry);
        }

        const mesh = new THREE.Mesh(
            this.geometry,
            new THREE.MeshLambertMaterial({color: color})
        );

        if (options) {
            if (options.xOffset !== undefined) {
                mesh.translateX(options.xOffset * this.width);
            }

            if (options.yOffset !== undefined) {
                mesh.translateY(options.yOffset * this.height);
            }

            if (options.zOffset !== undefined) {
                mesh.translateZ(options.zOffset * this.depth);
            }

            if (options.xRot !== undefined) {
                mesh.rotateX(options.xRot * Math.PI);
            }

            if (options.yRot !== undefined) {
                mesh.rotateY(options.yRot * Math.PI);
            }

            if (options.zRot !== undefined) {
                mesh.rotateZ(options.zRot * Math.PI);
            }


            let lastAnimation;
            let animateInTween;
            if (options.animateIn !== undefined) {
                const animation = options.animateIn;
                const startScale = animation.start.scale;
                if (startScale !== undefined) {
                    mesh.scale.x = startScale;
                    mesh.scale.y = startScale;
                    mesh.scale.z = startScale;
                }
                animateInTween = this.setupAnimation(mesh, animation);
                lastAnimation = animateInTween;
            }

            if (options.animations !== undefined) {
                let firstAnimation;
                for (const animation of options.animations) {
                    const newAnimation = this.setupAnimation(mesh, animation);
                    if (lastAnimation) {
                        lastAnimation.chain(newAnimation);
                    }

                    lastAnimation = newAnimation;

                    if (!firstAnimation) {
                        firstAnimation = newAnimation;
                    }
                }

                lastAnimation.chain(firstAnimation);

                if (!animateInTween) {
                    firstAnimation.start();
                }
            }

            if (animateInTween) {
                animateInTween.start();
            }
        }
        mesh.originalColor = color;
        mesh.parentEntity = this.parentEntity;
        this.meshes.push(mesh);

        return mesh;
    }

    setupAnimation(mesh, options) {
        let time;
        if (options.time !== undefined) {
            time = options.time;
        } else {
            time = 500;
        }

        const end = {
            x: options.end.scale,
            y: options.end.scale,
            z: options.end.scale
        };

        const tween = new TWEEN.Tween(mesh.scale).to(end, time);
        tween.onUpdate(function() {
            const percent = ((TWEEN.now() - this._startTime) / this._duration);

            if (options.zRotation !== undefined) {
                mesh.rotation.z = options.zRotation * percent * 2 * Math.PI;
            }

            engine.needsMapUpdate = true;
        });

        return tween;
    }
}