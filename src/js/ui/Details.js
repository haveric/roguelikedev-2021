import html from "../../html/ui/Details.html";
import engine from "../Engine";
import UIElement from "./UIElement";

class Details extends UIElement {
    constructor() {
        super(html);
    }

    updatePlayerDetails() {
        this.updatePositionDetails(engine.player, true);
    }

    getPosition(entity) {
        const position = entity.getComponent("positionalobject");
        const x = position.x;
        const y = position.y;
        return "<span class='details__line'>Looking at: X:" + x + " - Y:" + y + "</span>";
    }

    updatePositionOnly(entity) {
        this.dom.innerHTML = this.getPosition(entity);
    }

    updatePositionDetails(entity, skipPlayer = false) {
        if (!entity) {
            return;
        }
        const position = entity.getComponent("positionalobject");
        const x = position.x;
        const y = position.y;
        const z = position.z;
        let zStart = z - 1;
        if (entity !== engine.player) {
            zStart = z;
        }
        let text = this.getPosition(entity);
        const tiles = engine.gameMap.tiles;
        for (let i = zStart; i <= z; i++) {
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
                text += "<span class='details__line'><span style='color:" + position.color + "'>" + position.letter + "</span>: " + actor.name;

                const fighter = actor.getComponent("fighter");
                if (fighter) {
                    text += " " + fighter.getHealthDescription();
                }
                text += "</span>";
            }
        }


        const itemLines = [];
        for (const item of engine.gameMap.items) {
            const position = item.getComponent("positionalobject");
            if (position && position.isVisible() && x === position.x && y === position.y && Math.abs(z - position.z) < 2) {
                itemLines.push("<span class='details__line'><span style='color:" + position.color + "'>" + position.letter + "</span>: " + item.name + "</span>");
            }
        }

        if (itemLines.length > 0) {
            text += "<span class='details__line details__header'>Items:</span>";
        }

        for (const line of itemLines) {
            text += line;
        }


        const nearby = [];
        for (const actor of engine.fov.visibleActors) {
            if (actor === engine.player || !actor.isAlive()) {
                continue;
            }

            const position = actor.getComponent("positionalobject");
            if (position) {
                nearby.push(actor);
            }
        }

        if (nearby.length > 0) {
            text += "<span class='details__line details__header'>Nearby:</span>";

            for (const actor of nearby) {
                const position = actor.getComponent("positionalobject");
                if (position) {
                    text += "<span class='details__line'>";
                    text += "<span style='color:" + position.color + "'>" + position.letter + "</span>: " + actor.name;

                    const fighter = actor.getComponent("fighter");
                    if (fighter) {
                        text += " " + fighter.getHealthDescription();
                    }

                    text += "</span>";
                }
            }
        }

        this.dom.innerHTML = text;
    }
}

const details = new Details();
export default details;