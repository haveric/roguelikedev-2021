import engine from "../../Engine";

export default class BaseFov {
    constructor() {
        this.previousVisibleObjects = [];
        this.visibleObjects = [];
        this.visibleActors = [];
        this.visibleItems = [];
        this.oldObjects = [];
        this.newObjects = [];
        this.left = 0;
        this.right = 0;
        this.top = 0;
        this.bottom = 0;
    }

    teardown() {
        this.previousVisibleObjects = [];
        this.visibleObjects = [];
        this.visibleActors = [];
        this.visibleItems = [];
        this.oldObjects = [];
        this.newObjects = [];
    }

    compute(x, y, z, radius) {
        this.previousVisibleObjects = this.visibleObjects;
        this.visibleObjects = [];
        this.visibleActors = [];
        this.visibleItems = [];
        this.oldObjects = [];
        this.newObjects = [];

        this.left = Math.max(0, x - radius);
        this.right = Math.min(engine.gameMap.width, x + radius + 1);
        this.top = Math.max(0, y - radius);
        this.bottom = Math.min(engine.gameMap.height, y + radius + 1);
    }

    addVisibleObject(object) {
        if (this.visibleObjects.indexOf(object) === -1) {
            this.visibleObjects.push(object);
        }

        if (this.previousVisibleObjects.indexOf(object) === -1 && this.newObjects.indexOf(object) === -1) {
            this.newObjects.push(object);
        }
    }

    addVisibleActor(object) {
        if (this.visibleActors.indexOf(object) === -1) {
            this.visibleActors.push(object);
        }
    }

    addVisibleItem(object) {
        if (this.visibleItems.indexOf(object) === -1) {
            this.visibleItems.push(object);
        }
    }

    remove(object) {
        const newIndex = this.newObjects.indexOf(object);
        if (newIndex > -1) {
            this.newObjects.splice(newIndex, 1);
        }

        const oldIndex = this.oldObjects.indexOf(object);
        if (oldIndex > -1) {
            this.oldObjects.splice(oldIndex, 1);
        }

        const visibleIndex = this.visibleObjects.indexOf(object);
        if (visibleIndex > -1) {
            this.visibleObjects.splice(visibleIndex, 1);
        }

        const visibleItemsIndex = this.visibleItems.indexOf(object);
        if (visibleItemsIndex > -1) {
            this.visibleItems.splice(visibleItemsIndex, 1);
        }

        const previousVisibleItemsIndex = this.previousVisibleObjects.indexOf(object);
        if (previousVisibleItemsIndex > -1) {
            this.previousVisibleObjects.splice(previousVisibleItemsIndex, 1);
        }
    }

    exploreTile(x, y, minZ, maxZ, tilesOnly = false) {
        const tilesIter = engine.gameMap.tiles.entries();
        for (const entry of tilesIter) {
            if (entry[0] >= minZ && entry[0] <= maxZ) {
                const tilesArray = entry[1];
                const tileArrayX = tilesArray[x];
                if (tileArrayX) {
                    const tile = tileArrayX[y];

                    if (tile) {
                        this.addVisibleObject(tile);
                    }
                }
            }
        }

        if (!tilesOnly) {
            for (let actor of engine.gameMap.actors) {
                const positionalObject = actor.getComponent("positionalobject");
                if (positionalObject) {
                    if (positionalObject.x === x && positionalObject.y === y) {
                        this.addVisibleObject(actor);
                        this.addVisibleActor(actor);
                    }
                }
            }

            for (let item of engine.gameMap.items) {
                const positionalObject = item.getComponent("positionalobject");
                if (positionalObject) {
                    if (positionalObject.x === x && positionalObject.y === y) {
                        this.addVisibleObject(item);
                        this.addVisibleItem(item);
                    }
                }
            }
        }
    }
}