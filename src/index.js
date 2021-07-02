import './styles/style.css';
import sceneState from './js/SceneState.js';
import Character from "./js/entity/Character";
import controls from "./js/controls/Controls";
import GameMap from "./js/map/GameMap";
import MapLayer from "./js/map/MapLayer";

;(function () {
    const characters = [];
    let player,
    gameMap;

    let secondsPassed,
        oldTimeStamp;

    const init = function() {
        gameMap = new GameMap(20, 20);
        gameMap.createTestMap();

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

    }

    const animation = function(time) {
        sceneState.stats.begin();
        // Calculate the number of seconds passed since the last frame
        secondsPassed = (time - oldTimeStamp) / 1000;
        oldTimeStamp = time;

        // Move forward in time with a maximum amount
        secondsPassed = Math.min(secondsPassed, 0.1);

        handleInput(time);

        const playerPosition = player.getComponent("positionalobject");
        if (playerPosition) {
            gameMap.draw(playerPosition.x, playerPosition.y, 5);

            for (let character of characters) {
                const positionalObject = character.getComponent("positionalobject");
                if (positionalObject) {
                    if (Math.abs(positionalObject.x - playerPosition.x) < 6 && Math.abs(positionalObject.y - playerPosition.y) < 6) {
                        positionalObject.setVisible(true);
                    } else {
                        positionalObject.setVisible(false);
                    }
                }
            }
        }

        sceneState.renderer.render( sceneState.scene, sceneState.camera );
        sceneState.stats.end();
    }

    const handleInput = function(time) {
        const position = player.getComponent("positionalobject");
        const px = position.x;
        const py = position.y;
        if (position) {
            if (controls.testPressed("up")) {
                position.move(0, 1);
            } else if (controls.testPressed("down")) {
                position.move(0, -1);
            } else if (controls.testPressed("left")) {
                position.move(-1);
            } else if (controls.testPressed("right")) {
                position.move(1);
            } else if (controls.testPressed("nw")) {
                position.move(-1, 1);
            } else if (controls.testPressed("ne")) {
                position.move(1, 1);
            } else if (controls.testPressed("sw")) {
                position.move(-1, -1);
            } else if (controls.testPressed("se")) {
                position.move(1, -1);
            } else if (controls.testPressed("wait")) {
                position.move(0, 0);
            }

            if (px !== position.x || py !== position.y) {
                sceneState.updateCameraPosition(player);
            }
        }
    }

    init();
}());