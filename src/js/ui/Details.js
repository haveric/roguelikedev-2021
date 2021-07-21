import engine from "../Engine";

class Details {
    constructor() {
        this.dom = document.createElement("div");
        this.dom.classList.add("details");
    }

    updatePlayerDetails() {
        this.updatePositionDetails(engine.player, true);
    }

    updatePositionDetails(entity, skipPlayer = false) {
        const position = entity.getComponent("positionalobject");
        const x = position.x;
        const y = position.y;
        const z = position.z;
        let text = "<span class='details__line'>Looking at: X:" + x + " - Y:" + y + "</span>";
        const tiles = engine.gameMap.tiles;
        for (let i = z - 1; i <= z; i++) {
            if (tiles.get(i) && tiles.get(i)[x]) {
                const tile = tiles.get(i)[x][y];
                if (tile) {
                    text += "<span class='details__line'>" + tile.name + "</span>";
                }
            }
        }

        for (const actor of engine.gameMap.actors) {
            if (skipPlayer && actor === engine.player) {
                continue;
            }

            const position = actor.getComponent("positionalobject");
            if (position && position.isVisible() && x === position.x && y === position.y && Math.abs(z - position.z) < 2) {
                text += "<span class='details__line'><span style='color:" + position.color + "'>" + position.letter + "</span>: " + actor.name + "</span>";
            }
        }


        const itemLines = [];
        for (const item of engine.gameMap.items) {
            const position = item.getComponent("positionalobject");
            if (position && x === position.x && y === position.y && Math.abs(z - position.z) < 2) {
                itemLines.push("<span class='details__line'><span style='color:" + position.color + "'>" + position.letter + "</span>: " + item.name + "</span>");
            }
        }

        if (itemLines.length > 0) {
            text += "<span class='details__line details__header'>Items:</span>";
        }

        for (const line of itemLines) {
            text += line;
        }


        let nearby = new Map();
        for (const actor of engine.fov.visibleActors) {
            if (actor === engine.player || !actor.isAlive()) {
                continue;
            }

            const position = actor.getComponent("positionalobject");
            if (position) {
                const name = "<span style='color:" + position.color + "'>" + position.letter + "</span>: " + actor.name;

                if (nearby.has(name)) {
                    const num = nearby.get(name);
                    nearby.set(name, num + 1);
                } else {
                    nearby.set(name, 1);
                }
            }
        }

        if (nearby.size > 0) {
            text += "<span class='details__line details__header'>Nearby:</span>";
        }
        for (const entry of nearby.entries()) {
            const nameString = entry[0];
            const count = entry[1];
            text += "<span class='details__line'>" + nameString;

            if (count > 1) {
                text += " x" + count;
            }

            text += "</span>";
        }

        this.dom.innerHTML = text;
    }
}

const details = new Details();
export default details;