class GameState {
    constructor() {
        this.player = null;
        this.gameMap = null;
        this.needsMapUpdate = false;
    }
}

const gameState = new GameState();
export default gameState;