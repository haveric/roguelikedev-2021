import './styles/style.css';
import CanvasState from './js/CanvasState.js';

;(function () {
    let canvasState = new CanvasState();

    let secondsPassed,
        oldTimeStamp,
        fps;

    const init = function() {
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

        update(secondsPassed);
        render(secondsPassed);
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

        // Draw number to the screen
        canvasState.setFont('25px Arial');
        canvasState.setFillStyle('white');
        canvasState.context.fillText("FPS: " + fps, 10, 30);
    }

    init();
}());