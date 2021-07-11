import Fov from "../../components/Fov";

export default class BaseFov {
    constructor() {
        this.previousVisibleObjects = [];
        this.visibleObjects = [];
        this.oldObjects = [];
        this.newObjects = [];
    }

    compute(gameMap, x, y, radius) {
        this.previousVisibleObjects = this.visibleObjects;
        this.visibleObjects = [];
        this.oldObjects = [];
        this.newObjects = [];
    }

    postCompute() {
        for (const object of this.previousVisibleObjects) {
            const index = this.visibleObjects.indexOf(object);
            if (index === -1) {
                const fov = object.getComponent("fov");
                if (fov) {
                    fov.visible = false;
                }
                this.oldObjects.push(object);
            }
        }
    }

    addVisibleObject(object) {
        if (this.visibleObjects.indexOf(object) === -1) {
            this.visibleObjects.push(object);
        }

        if (this.previousVisibleObjects.indexOf(object) === -1) {
            this.newObjects.push(object);
        }
    }

    exploreTile(gameMap, x, y) {
        const tilesIter = gameMap.tiles.entries();
        for (const entry of tilesIter) {
            const tilesArray = entry[1];
            const tile = tilesArray[x][y];

            if (tile) {
                this.addVisibleObject(tile);

                const fov = tile.getComponent("fov");
                if (fov) {
                    fov.explored = true;
                    fov.visible = true;
                } else {
                    tile.setComponent(new Fov({explored: true, visible: true}));
                }
            }
        }

        for (let actor of gameMap.actors) {
            const positionalObject = actor.getComponent("positionalobject");
            if (positionalObject) {
                if (positionalObject.x === x && positionalObject.y === y) {
                    this.addVisibleObject(actor);
                }
            }
        }

        for (let item of gameMap.items) {
            const positionalObject = item.getComponent("positionalobject");
            if (positionalObject) {
                if (positionalObject.x === x && positionalObject.y === y) {
                    this.addVisibleObject(item);
                }
            }
        }
    }
}