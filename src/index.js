import './styles/style.css';
import sceneState from './js/SceneState.js';
import controls from "./js/controls/Controls";
import gameState from "./js/GameState";
import TutorialMap from "./js/map/TutorialMap";

;(function () {
    let secondsPassed,
        oldTimeStamp;

    const init = function() {
        //gameState.gameMap = new TestMap(20, 20);
        gameState.gameMap = new TutorialMap();
        gameState.gameMap.create();

        sceneState.updateCameraPosition(gameState.player);

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

        const playerPosition = gameState.player.getComponent("positionalobject");
        if (playerPosition) {
            gameState.gameMap.draw(playerPosition.x, playerPosition.y, 5);
        }

        sceneState.renderer.render(sceneState.scene, sceneState.camera);
        sceneState.stats.end();
    }

    const handleInput = function(time) {
        const position = gameState.player.getComponent("positionalobject");
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
            } else if (controls.testPressed("save", 1000)) {
                gameState.gameMap.save("save1");
            } else if (controls.testPressed("load", 1000)) {
                gameState.gameMap.load("save1");
            }

            if (px !== position.x || py !== position.y) {
                sceneState.updateCameraPosition(gameState.player);
            }
        }
    }

    init();
}());