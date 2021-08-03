import './styles/style.css';
import sceneState from './js/SceneState.js';
import engine from "./js/Engine";
import Town from "./js/map/Town";
import {TWEEN} from "three/examples/jsm/libs/tween.module.min";
import details from "./js/ui/Details";
import MainMenuMap from "./js/map/MainMenuMap";

(function () {
    const init = function() {
        engine.clearMaps();
        engine.setMap(new MainMenuMap());
        engine.gameMap.create();
        const playerPosition = engine.player.getComponent("positionalobject");
        engine.gameMap.revealFromPosition(playerPosition.x, playerPosition.y, 100, 0);
        engine.needsMapUpdate = true;
        //engine.gameMap = new Town(50, 50);

        sceneState.renderer.setAnimationLoop(animation);
    }

    const animation = function(time) {
        sceneState.stats.begin();

        engine.handleEvents();
        if (engine.needsMapUpdate) {
            updateRender();
            engine.needsMapUpdate = false;
        }

        TWEEN.update();

        sceneState.stats.end();
    }

    const updateRender = function() {
        if (engine.player) {
            const playerPosition = engine.player.getComponent("positionalobject");
            if (playerPosition) {
                let playerVisibility = 5;
                const tileAtPlayer = engine.gameMap.tiles.get(playerPosition.z)[playerPosition.x][playerPosition.y];
                if (tileAtPlayer) {
                    const modifier = tileAtPlayer.getComponent("visibilityModifier");
                    if (modifier) {
                        playerVisibility = modifier.getVisibility(playerVisibility);
                    }
                }

                const isFovNew = engine.fov.visibleObjects.length === 0;

                engine.gameMap.updateFOV(playerPosition.x, playerPosition.y, playerPosition.z, playerVisibility);
                engine.gameMap.draw(playerPosition.x, playerPosition.y, playerPosition.z);

                if (isFovNew) {
                    details.updatePlayerDetails();
                }
            }

            sceneState.renderer.render(sceneState.scene, sceneState.camera);
        }
    }

    init();
}());