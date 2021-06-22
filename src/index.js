import './styles/style.css';
import sceneState from './js/SceneState.js';
import Tile from "./js/entity/Tile";
import Character from "./js/entity/Character";
import controls from "./js/controls/Controls";

;(function () {
    const tiles = [];
    const characters = [];
    let player;
    let secondsPassed,
        oldTimeStamp,
        fps;


    const init = function() {
        const scene = sceneState.scene;
        for (let i = -25; i < 26; i++) {
            for (let j = -25; j < 26; j++) {
                let tile
                if (j === 3 || i === 3) {
                    tile = new Tile(i, j, 0, 0x3333cc, .75);
                } else {
                    tile = new Tile(i, j, 0);
                }
                tile.tile.visible = false;
                scene.add(tile.tile);
                tiles.push(tile);
            }
        }

        player = new Character(0, 0, 1, 0xffffff, '@');
        player.tile.visible = false;
        characters.push(player);
        scene.add(player.tile);

        for (let i = -2; i < 3; i++) {
            let goblin = new Character(i, -2, 1, 0x33cc33, 'g');
            goblin.tile.visible = false;
            characters.push(goblin);
            scene.add(goblin.tile);
        }

        sceneState.renderer.setAnimationLoop(animation);
    }

    const animation = function(time) {
        // Calculate the number of seconds passed since the last frame
        secondsPassed = (time - oldTimeStamp) / 1000;
        oldTimeStamp = time;

        // Move forward in time with a maximum amount
        secondsPassed = Math.min(secondsPassed, 0.1);


        // Calculate fps
        fps = Math.round(1 / secondsPassed);

        handleInput(time);


        const x = player.x;
        const y = player.y;
        for (let tile of tiles) {
            if (Math.abs(tile.x - x) < 6 && Math.abs(tile.y - y) < 6) {
                tile.setVisible(true);
            } else {
                tile.setVisible(false);
            }
            tile.updateZ(secondsPassed * 4);
        }

        for (let character of characters) {
            if (Math.abs(character.x - x) < 6 && Math.abs(character.y - y) < 6) {
                character.setVisible(true);
            } else {
                character.setVisible(false);
            }
            character.updateZ(secondsPassed * 4);
        }

        sceneState.renderer.render( sceneState.scene, sceneState.camera );
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