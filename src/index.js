import './styles/style.css';
import canvasState from './js/CanvasState.js';
import textures from "./js/sprite/Textures";
import sprites from "./js/sprite/Sprites";
import placeholder from './img/placeholder.gif';
import player from './img/player.gif';

;(function () {
    let secondsPassed,
        oldTimeStamp,
        fps;

    const init = function() {
        textures.add('placeholder', placeholder);
        textures.add('player', player);
        sprites.add('path', 'placeholder');
        sprites.add('player', 'player');

        gameLoop();
    }

    const gameLoop = function(timeStamp) {
        window.requestAnimationFrame(gameLoop);

        // Calculate the number of seconds passed since the last frame
        secondsPassed = (timeStamp - oldTimeStamp) / 1000;
        oldTimeStamp = timeStamp;

        // Move forward in time with a maximum amount
        secondsPassed = Math.min(secondsPassed, 0.1);

        // Calculate fps
        fps = Math.round(1 / secondsPassed);

        if (sprites.preload()) {
            update(secondsPassed);
            render(secondsPassed);
        }
    }

    const update = function(secondsPassed) {
        handleInput(secondsPassed);
        handleMovement(secondsPassed);
    }

    const handleInput = function(secondsPassed) {

    }

    const handleMovement = function(secondsPassed) {

    }

    const render = function(secondsPassed) {
        canvasState.prepareToDraw();

        let sprite = sprites.get('player');
        sprite.drawImage(500, 500, 0);

        // Draw number to the screen
        canvasState.setFont('25px Arial');
        canvasState.setFillStyle('white');
        canvasState.context.fillText("FPS: " + fps, 10, 30);
    }

    init();
}());