import './styles/style.css';
import sceneState from './js/SceneState.js';
import Tile from "./js/entity/Tile";
import Character from "./js/entity/Character";

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
                if (j === 7 || i === 7) {
                    tile = new Tile(i, j, 0, 0x3333cc);
                    tile.maxScaleZ = 0.75;
                } else {
                    tile = new Tile(i, j, 0);
                }
                scene.add(tile.tile);
                tiles.push(tile);
            }
        }


        player = new Character(0, 0, 1, 0xffffff, '@');
        characters.push(player);
        scene.add(player.tile);

        for (let i = -2; i < 3; i++) {
            let goblin = new Character(i, -2, 1, 0x33cc33, 'g');
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

        for (let tile of tiles) {
            tile.updateZ(secondsPassed * 5);
        }


        for (let character of characters) {
            //character.updateZ(secondsPassed * 5);
        }

        sceneState.renderer.render( sceneState.scene, sceneState.camera );
    }

    init();
}());