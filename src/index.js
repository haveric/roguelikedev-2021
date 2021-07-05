import './styles/style.css';
import sceneState from './js/SceneState.js';
import controls from "./js/controls/Controls";
import gameState from "./js/GameState";
import TutorialMap from "./js/map/TutorialMap";

;(function () {
    const init = function() {
        //gameState.gameMap = new TestMap(20, 20);
        gameState.gameMap = new TutorialMap();
        gameState.gameMap.create();

        sceneState.updateCameraPosition(gameState.player);

        sceneState.renderer.setAnimationLoop(animation);
        gameState.needsMapUpdate = true;
    }

    const animation = function(time) {
        sceneState.stats.begin();

        handleInput(time);
        if (gameState.needsMapUpdate) {
            updateRender();
            gameState.needsMapUpdate = false;
        }

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
                gameState.needsMapUpdate = true;
            }
        }
    }

    const updateRender = function() {
        const playerPosition = gameState.player.getComponent("positionalobject");
        if (playerPosition) {
            gameState.gameMap.draw(playerPosition.x, playerPosition.y, 5);
        }

        sceneState.renderer.render(sceneState.scene, sceneState.camera);
    }

    init();
}());