import engine from "../Engine";

class Details {
    constructor() {
        this.dom = document.createElement("div");
        this.dom.classList.add("details");
    }

    updatePlayerDetails() {
        this.updatePositionDetails(true);
    }

    updatePositionDetails(skipPlayer) {
        const player = engine.player;
        const position = player.getComponent("positionalobject");
        const x = position.x;
        const y = position.y;
        const z = position.z;
        let text = "Looking at: X:" + x + " - Y:" + y + "\n";
        const tiles = engine.gameMap.tiles;
        for (let i = z - 1; i <= z; i++) {
            if (tiles.get(i) && tiles.get(i)[x]) {
                const tile = tiles.get(i)[x][y];
                if (tile) {
                    text += tile.name + "\n";
                }
            }
        }

        for (const actor of engine.gameMap.actors) {
            if (skipPlayer && actor === engine.player) {
                continue;
            }

            const position = actor.getComponent("positionalobject");
            if (position && x === position.x && y === position.y && z === position.z) {
                text += position.letter + ": " + actor.name + "\n";
            }
        }

        for (const item of engine.gameMap.items) {
            const position = item.getComponent("positionalobject");
            if (position && x === position.x && y === position.y && z === position.z) {
                text += position.letter + ": " + item.name + "\n";
            }
        }

        this.dom.innerText = text;
    }
}

const details = new Details();
export default details;