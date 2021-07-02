import './styles/style.css';
import sceneState from './js/SceneState.js';
import Character from "./js/entity/Character";
import controls from "./js/controls/Controls";
import Stats from "stats.js";
import ArrayUtil from "./js/util/ArrayUtil";
import * as THREE from "three";
import CharacterTile from "./js/entity/CharacterTile";
import SolidTile from "./js/entity/SolidTile";
import _Tile from "./js/entity/_Tile";

;(function () {
    const characters = [];
    let player;
    let secondsPassed,
        oldTimeStamp,
        stats;


    const rows = 20;
    const cols = 20;
    const floorTiles = ArrayUtil.create2dArray(rows);
    const wallTiles = ArrayUtil.create2dArray(rows);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let highlightedTile = null;

    const init = function() {
        stats = new Stats();
        stats.showPanel(0);
        document.body.appendChild(stats.dom);

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let tile;
                if (j === 5 || i === 5) {
                    wallTiles[i][j] = new CharacterTile("Wall", i, j, 1, 1, "#", 0x666666);
                }

                if (i === 12 && j === 12) {
                    wallTiles[i][j] = new CharacterTile("Door", i, j, 1, 1, "+", 0x964b00);
                }

                if (j === 3 || i === 3) {
                    tile = new CharacterTile("Water", i, j, 0, .7, "≈", 0x3333cc);
                } else {
                    tile = new SolidTile("Floor", i, j, 0, 1, 0x333333);
                }

                floorTiles[i][j] = tile;
            }
        }

        player = new Character("Player", 10, 10, 1, '@', 0xffffff);
        characters.push(player);
        const positionalObject = player.getComponent("positionalobject");
        positionalObject.setVisible(true);
        sceneState.scene.add(positionalObject.object);
        sceneState.updateCameraPosition(player);

        for (let i = 2; i < 8; i++) {
            let goblin = new Character("Goblin", i, 7, 1, 'g', 0x33cc33);
            characters.push(goblin);
        }

        sceneState.renderer.setAnimationLoop(animation);
        sceneState.renderer.domElement.addEventListener('mousemove', onMouseMove, false);
    }

    const onMouseMove = function(e) {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, sceneState.camera);

        const intersects = raycaster.intersectObject(sceneState.scene, true);

        let anyFound = false;
        for (let i = 0; i < intersects.length; i++) {
            const object = intersects[i].object;
            const parentEntity = object.parentEntity;
            if (parentEntity && parentEntity instanceof _Tile) {
                const parentObject = parentEntity.getComponent("positionalobject");
                if (parentObject && !parentObject.highlighted) {
                    if (highlightedTile !== null) {
                        const object = highlightedTile.getComponent("positionalobject");
                        if (object) {
                            object.removeHighlight();
                        }
                    }
                    highlightedTile = parentEntity;
                    parentObject.highlight();
                }

                anyFound = true;
                break;
            }
        }

        if (!anyFound) {
            if (highlightedTile !== null) {
                const object = highlightedTile.getComponent("positionalobject");
                if (object) {
                    object.removeHighlight();
                }
            }
        }
    }

    const animation = function(time) {
        stats.begin();
        // Calculate the number of seconds passed since the last frame
        secondsPassed = (time - oldTimeStamp) / 1000;
        oldTimeStamp = time;

        // Move forward in time with a maximum amount
        secondsPassed = Math.min(secondsPassed, 0.1);

        handleInput(time);

        const playerPositionalObject = player.getComponent("positionalobject");
        if (playerPositionalObject) {
            const playerX = playerPositionalObject.x;
            const playerY = playerPositionalObject.y;
            const left = Math.max(0, playerX - 5);
            const right = Math.min(rows, playerX + 5);
            const top = Math.max(0, playerY - 5);
            const bottom = Math.min(cols, playerY + 5);

            for (let i = left; i < right; i++) {
                for (let j = top; j < bottom; j++) {
                    const tile = floorTiles[i][j];
                    if (tile) {
                        const tileObject = tile.getComponent("positionalobject");
                        if (tileObject && !tileObject.isVisible()) {
                            tileObject.setVisible(true);
                            sceneState.scene.add(tileObject.object);
                        }
                    }

                    const wallTile = wallTiles[i][j];
                    if (wallTile) {
                        const wallTileObject = wallTile.getComponent("positionalobject");
                        if (wallTileObject && !wallTileObject.isVisible()) {
                            wallTileObject.setVisible(true);
                            sceneState.scene.add(wallTileObject.object);
                        }
                    }
                }
            }

            for (let character of characters) {
                const positionalObject = character.getComponent("positionalobject");
                if (positionalObject) {
                    if (Math.abs(positionalObject.x - playerX) < 6 && Math.abs(positionalObject.y - playerY) < 6) {
                        positionalObject.setVisible(true);
                    } else {
                        positionalObject.setVisible(false);
                    }
                }
            }
        }

        sceneState.renderer.render( sceneState.scene, sceneState.camera );
        stats.end();
    }

    const handleInput = function(time) {
        const position = player.getComponent("positionalobject");
        if (position) {
            let anyMoved = false;
            if (controls.testPressed("up")) {
                position.move(0, 1);
                anyMoved = true;
            } else if (controls.testPressed("down")) {
                position.move(0, -1);
                anyMoved = true;
            } else if (controls.testPressed("left")) {
                position.move(-1);
                anyMoved = true;
            } else if (controls.testPressed("right")) {
                position.move(1);
                anyMoved = true;
            } else if (controls.testPressed("nw")) {
                position.move(-1, 1);
                anyMoved = true;
            } else if (controls.testPressed("ne")) {
                position.move(1, 1);
                anyMoved = true;
            } else if (controls.testPressed("sw")) {
                position.move(-1, -1);
                anyMoved = true;
            } else if (controls.testPressed("se")) {
                position.move(1, -1);
                anyMoved = true;
            } else if (controls.testPressed("wait")) {
                position.move(0, 0);
                anyMoved = true;
            }

            if (anyMoved) {
                sceneState.updateCameraPosition(player);
            }
        }
    }

    init();
}());