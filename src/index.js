import './styles/style.css';
import sceneState from './js/SceneState.js';
import TutorialMap from "./js/map/TutorialMap";
import engine from "./js/Engine";

;(function () {
    const init = function() {
        //engine.gameMap = new TestMap(20, 20);
        engine.gameMap = new TutorialMap();
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
            engine.gameMap.draw(playerPosition.x, playerPosition.y, 5);
        }

        sceneState.renderer.render(sceneState.scene, sceneState.camera);
    }

    init();
}());