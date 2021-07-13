import './styles/style.css';
import sceneState from './js/SceneState.js';
import engine from "./js/Engine";
import BasicDungeon from "./js/map/BasicDungeon";
import Town from "./js/map/Town";

;(function () {
    const init = function() {
        //engine.gameMap = new BasicDungeon(100, 100);
        engine.gameMap = new Town(50, 50);
        engine.gameMap.create();

        sceneState.updateCameraPosition(engine.player);

        sceneState.renderer.setAnimationLoop(animation);
        engine.needsMapUpdate = true;
    }

    const animation = function(time) {
        sceneState.stats.begin();

        engine.handleEvents();
        if (engine.needsMapUpdate) {
            updateRender();
            engine.needsMapUpdate = false;
        }

        sceneState.stats.end();
    }

    const updateRender = function() {
        const playerPosition = engine.player.getComponent("positionalobject");
        if (playerPosition) {
            engine.gameMap.updateFOV(playerPosition.x, playerPosition.y, 5);
            engine.gameMap.draw(playerPosition.x, playerPosition.y);
        }

        sceneState.renderer.render(sceneState.scene, sceneState.camera);
    }

    init();
}());