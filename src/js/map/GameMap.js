import ArrayUtil from "../util/ArrayUtil";
import MapLayer from "./MapLayer";
import sceneState from "../SceneState";
import entityLoader from "../entity/EntityLoader";
import engine from "../Engine";
import _Tile from "../entity/_Tile";

export default class GameMap {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.init();
    }

    init() {
        this.tiles = new Map();
        this.tiles.set(MapLayer.Floor, ArrayUtil.create2dArray(this.width));
        this.tiles.set(MapLayer.Wall, ArrayUtil.create2dArray(this.width));
        this.tiles.set(MapLayer.DecorativeBG, ArrayUtil.create2dArray(this.width));
        this.tiles.set(MapLayer.Decorative, ArrayUtil.create2dArray(this.width));

        this.actors = [];
        this.items = [];
    }

    create() {};

    teardown() {
        const tilesIter = this.tiles.entries();
        for (const entry of tilesIter) {
            const tilesArray = entry[1];
            for (let i = 0; i < this.width; i++) {
                for (let j = 0; j < this.height; j++) {
                    const tile = tilesArray[i][j];
                    if (tile) {
                        const position = tile.getComponent("positionalobject");
                        if (position) {
                            position.teardown();
                        }
                    }
                }
            }
        }

        for (const actor of this.actors) {
            const position = actor.getComponent("positionalobject");
            if (position) {
                position.teardown();
            }
        }

        for (const item of this.items) {
            const position = item.getComponent("positionalobject");
            if (position) {
                position.teardown();
            }
        }
    }

    save(name) {
        let saveData = {
            width: this.width,
            height: this.height
        };

        saveData["tiles"] = {};
        const entries = this.tiles.entries();
        for (const entry of entries) {
            const tileMap = new Map();
            let key = "";
            let charCode = 65;

            for (let i = 0; i < this.width; i++) {
                for (let j = 0; j < this.height; j++) {
                    const tile = entry[1][i][j];
                    if (tile) {
                        const tileJson = JSON.stringify(tile.save());
                        if (!tileMap.has(tileJson)) {
                            tileMap.set(tileJson, charCode);
                        }
                        key += String.fromCharCode(tileMap.get(tileJson));
                        charCode++;
                        if (String.fromCharCode(charCode) === ' ') {
                            charCode++;
                        }
                    } else {
                        key += ' ';
                    }
                }
            }

            const mapKey = entry[0];
            saveData["tiles"][mapKey] = {};
            saveData["tiles"][mapKey]["key"] = key;
            saveData["tiles"][mapKey]["map"] = {};

            const tileMapIter = tileMap.entries();
            for (const tileMapEntry of tileMapIter) {
                saveData["tiles"][mapKey]["map"][String.fromCharCode(tileMapEntry[1])] = tileMapEntry[0];
            }
        }

        let actorJson = [];
        for (const actor of this.actors) {
            actorJson.push(JSON.stringify(actor.save()));
        }
        saveData["actors"] = actorJson;

        let itemJson = [];
        for (const item of this.items) {
            itemJson.push(JSON.stringify(item.save()));
        }
        saveData["items"] = itemJson;

        localStorage.setItem(name, JSON.stringify(saveData));
    }

    load(name) {
        this.teardown();

        const loadData = localStorage.getItem(name);
        if (loadData) {
            const json = JSON.parse(loadData);
            this.width = json.width;
            this.height = json.height;
            this.init();

            const tiles = json.tiles;

            const entries = this.tiles.entries();
            for (const entry of entries) {
                const tileLayer = entry[1];
                const tilesToLoad = tiles[entry[0]];
                if (tilesToLoad) {
                    const key = tilesToLoad.key;
                    const map = tilesToLoad.map;

                    for (let i = 0; i < this.width; i++) {
                        for (let j = 0; j < this.height; j++) {
                            const index = i*this.height + j;
                            const tile = map[key[index]];

                            if (tile) {
                                tileLayer[i][j] = entityLoader.create(tile, {x: i, y: j, z: entry[0]});
                            }
                        }
                    }
                }
            }

            const actors = json.actors;
            for (const actor of actors) {
                const createdActor = entityLoader.create(actor);
                if (createdActor.name === 'Player') {
                    engine.player = createdActor;
                }
                this.actors.push(createdActor);
            }
            const items = json.items;
            for (const item of items) {
                const createdItem = entityLoader.create(item);
                this.items.push(createdItem);
            }

            const positionalObject = engine.player.getComponent("positionalobject");
            positionalObject.setVisible();
            sceneState.updateCameraPosition(engine.player);
        }
    }

    isInBounds(x, y) {
        return 0 <= x && x < this.width && 0 <= y && y < this.height;
    }

    reveal() {
        const tileIter = this.tiles.entries();
        for (const entry of tileIter) {
            for (let i = 0; i < this.width; i++) {
                for (let j = 0; j < this.height; j++) {
                    const tile = entry[1][i][j];
                    if (tile) {
                        const tileObject = tile.getComponent("positionalobject");
                        if (tileObject) {
                            tileObject.setVisible();
                        }
                    }
                }
            }
        }
    }

    updateFOV(x, y, range) {
        engine.fov.compute(x, y, range);
    }

    draw(x, y) {
        const newObjects = engine.fov.newObjects;
        for (const newObject of newObjects) {
            const object = newObject.getComponent("positionalobject");
            if (object) {
                if (!object.isVisible()) {
                    object.setVisible();
                    sceneState.scene.add(object.object);
                } else {
                    object.object.material.color.set(object.color);
                }
            }
        }

        const visibleObjects = engine.fov.visibleObjects;
        for (const visibleObject of visibleObjects) {
            if (visibleObject instanceof _Tile) {
                const object = visibleObject.getComponent("positionalobject");
                if (object) {
                    const xDiff = Math.abs(x - object.x);
                    const yDiff = Math.abs(y - object.y);
                    if (object.z >= 1 && xDiff <= 1 && yDiff <= 1) {
                        object.object.material.transparent = true;
                        if (object.z > 1) {
                            object.object.material.opacity = .1;
                        } else {
                            object.object.material.opacity = .5;
                        }
                    } else {
                        object.object.material.opacity = 1;
                    }
                }
            }
        }

        const oldObjects = engine.fov.oldObjects;
        for (const oldObject of oldObjects) {
            const object = oldObject.getComponent("positionalobject");
            if (object) {
                object.object.material.color.multiplyScalar(.5);
            }
        }
    }
}