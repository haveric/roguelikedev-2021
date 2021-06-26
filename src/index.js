import './styles/style.css';
import sceneState from './js/SceneState.js';
import Tile from "./js/entity/Tile";
import Character from "./js/entity/Character";
import controls from "./js/controls/Controls";
import Stats from "stats.js";
import ArrayUtil from "./js/util/ArrayUtil";
import * as THREE from "three";

;(function () {
    const characters = [];
    let player;
    let secondsPassed,
        oldTimeStamp,
        stats;


    const rows = 20;
    const cols = 20;
    const floorTiles = ArrayUtil.create2dArray(rows);
    const tilesNeedUpdating = [];

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
                if (j === 3 || i === 3) {
                    tile = new Tile(i, j, 0, 0x3333cc, .75);
                } else {
                    tile = new Tile(i, j, 0);
                }

                floorTiles[i][j] = tile;
            }
        }

        player = new Character(10, 10, 1, 0xffffff, '@');
        characters.push(player);
        player.setVisible(true);
        sceneState.scene.add(player.object);
        sceneState.updateCameraPosition(player);

        for (let i = 2; i < 8; i++) {
            let goblin = new Character(i, 7, 1, 0x33cc33, 'g');
            characters.push(goblin);
            goblin.setVisible(true);
            sceneState.scene.add(goblin.object);
        }

        const left = Math.max(0, player.x - 5);
        const right = Math.min(rows, player.x + 5);
        const top = Math.max(0, player.y - 5);
        const bottom = Math.min(cols, player.y + 5);

        for (let i = left; i < right; i++) {
            for (let j = top; j < bottom; j++) {
                const tile = floorTiles[i][j];
                if (tile) {
                    tile.setVisible(true);
                    sceneState.scene.add(tile.object);
                }
            }
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
            const parent = object.parentEntity;
            if (parent && parent instanceof Tile) {
                if (!parent.highlighted) {
                    if (highlightedTile !== null) {
                        highlightedTile.unhighlight();
                    }
                    highlightedTile = parent;
                    parent.highlight();
                }

                anyFound = true;
                break;
            }
        }

        if (!anyFound) {
            if (highlightedTile !== null) {
                highlightedTile.unhighlight();
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



        const left = Math.max(0, player.x - 5);
        const right = Math.min(rows, player.x + 5);
        const top = Math.max(0, player.y - 5);
        const bottom = Math.min(cols, player.y + 5);

        for (const tile of tilesNeedUpdating) {
            if (tile.updateZ(secondsPassed * 4)) {
                const index = tilesNeedUpdating.indexOf(tile);
                if (index !== -1) {
                    tilesNeedUpdating.splice(index, 1);
                }
            }
        }

        for (let i = left; i < right; i++) {
            for (let j = top; j < bottom; j++) {
                const tile = floorTiles[i][j];
                if (tile) {
                    if (!tile.isVisible()) {
                        tile.setVisible(true);
                        sceneState.scene.add(tile.object);
                        tilesNeedUpdating.push(tile);
                    }
                }
            }
        }

        for (let character of characters) {
            if (Math.abs(character.x - player.x) < 6 && Math.abs(character.y - player.y) < 6) {
                character.setVisible(true);
            } else {
                character.setVisible(false);

            }
            character.updateZ(secondsPassed * 4);
        }

        sceneState.renderer.render( sceneState.scene, sceneState.camera );
        stats.end();
    }

    const handleInput = function(time) {
        let anyMoved = false;
        if (controls.testPressed("up")) {
            player.moveUp();
            anyMoved = true;
        } else if (controls.testPressed("down")) {
            player.moveDown();
            anyMoved = true;
        }

        if (controls.testPressed("left")) {
            player.moveLeft();
            anyMoved = true;
        } else if (controls.testPressed("right")) {
            player.moveRight();
            anyMoved = true;
        }

        if (anyMoved) {
            player.updatePosition();
            sceneState.updateCameraPosition(player);
        }
    }

    init();
}());