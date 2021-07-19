import './styles/style.css';
import sceneState from './js/SceneState.js';
import engine from "./js/Engine";
import BasicDungeon from "./js/map/BasicDungeon";
import Town from "./js/map/Town";
import {TWEEN} from "three/examples/jsm/libs/tween.module.min";
import messageConsole from "./js/ui/MessageConsole";

(function () {
    const init = function() {
        //engine.gameMap = new BasicDungeon(100, 100);
        engine.gameMap = new Town(50, 50);
        engine.gameMap.create();

        sceneState.updateCameraPosition(engine.player);

        sceneState.renderer.setAnimationLoop(animation);
        engine.needsMapUpdate = true;

        messageConsole.text("Welcome adventurer!").build();
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

            engine.gameMap.updateFOV(playerPosition.x, playerPosition.y, playerPosition.z, playerVisibility);
            engine.gameMap.draw(playerPosition.x, playerPosition.y, playerPosition.z);
        }

        sceneState.renderer.render(sceneState.scene, sceneState.camera);
    }

    init();
}());