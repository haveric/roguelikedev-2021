import ArrayUtil from "../util/ArrayUtil";
import sceneState from "../SceneState";
import entityLoader from "../entity/EntityLoader";
import engine from "../Engine";
import _Tile from "../entity/_Tile";
import Fov from "../components/Fov";
import characterHealth from "../ui/CharacterHealth";
import details from "../ui/Details";
import characterMana from "../ui/CharacterMana";

export default class GameMap {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.init();
    }

    init() {
        this.tiles = new Map();
        for (let i = -1; i <= 2; i++) {
            this.tiles.set(i, ArrayUtil.create2dArray(this.width));
        }

        this.actors = [];
        this.items = [];
    }

    create() {};

    teardown() {
        engine.fov.teardown();
        engine.airFov.teardown();

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
                                tileLayer[i][j] = entityLoader.create(tile, {components: {positionalobject: {x: i, y: j, z: entry[0]}}});
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

    updateFOV(x, y, z, range) {
        engine.fov.compute(x, y, z, range, z-2, z+1);
        engine.airFov.compute(x, y, z,range * 2, z+2, z+8);
    }

    draw(x, y, z) {
        this.drawItemsInFov(engine.fov, x, y, z);
        this.drawItemsInFov(engine.airFov, x, y, z);
    }

    drawItemsInFov(fov, x, y, z) {
        const newObjects = fov.newObjects;
        for (const newObject of newObjects) {
            if (newObject instanceof _Tile) {
                const fovComponent = newObject.getComponent("fov");
                if (fovComponent) {
                    fovComponent.explored = true;
                    fovComponent.visible = true;
                } else {
                    newObject.setComponent(new Fov({components: {fov: {explored: true, visible: true}}}));
                }
            }
        }

        for (const object of fov.previousVisibleObjects) {
            const index = fov.visibleObjects.indexOf(object);
            if (index === -1) {
                const fovComponent = object.getComponent("fov");
                if (fovComponent) {
                    fovComponent.visible = false;
                }
                fov.oldObjects.push(object);
            }
        }

        for (const newObject of newObjects) {
            const object = newObject.getComponent("positionalobject");
            if (object) {
                if (!object.isVisible()) {
                    object.setVisible();
                    sceneState.scene.add(object.object);
                } else {
                    object.resetColor();
                }
            }
        }

        const visibleObjects = fov.visibleObjects;
        for (const visibleObject of visibleObjects) {
            if (visibleObject instanceof _Tile) {
                const object = visibleObject.getComponent("positionalobject");

                if (object) {
                    this.setTransparency(object, x, y, z);
                }
            }
        }

        const oldObjects = fov.oldObjects;
        for (const oldObject of oldObjects) {
            const object = oldObject.getComponent("positionalobject");
            if (object) {
                this.setTransparency(object, x, y, z);

                if (object.hasObject()) {
                    object.shiftColor(.5);
                }
            }
        }
    }

    setTransparency(object, x, y, z) {
        if (object.z >= z) {
            const xDiff = Math.abs(x - object.x);
            const yDiff = Math.abs(y - object.y);
            if (object.z > z) {
                if (object.x >= x && object.y <= y && Math.max(xDiff, yDiff) < object.z + 3) {
                    if (object.z > z + 1) {
                        object.setTransparency(0);
                    } else {
                        object.setTransparency(.1);
                    }
                } else {
                    object.setTransparency(1);
                }
            } else {
                if (object.z <= z + 1 && xDiff <= 1 && yDiff <= 1) {
                    object.setTransparency(.5);
                } else {
                    object.setTransparency(1);
                }
            }
        } else {
            object.setTransparency(1);
        }
    }

    getBlockingActorAtLocation(x, y, z) {
        let blockingActor = null;
        for (const actor of this.actors) {
            const position = actor.getComponent("positionalobject");
            if (position && x === position.x && y === position.y && z === position.z) {
                const component = actor.getComponent("blocksMovement");
                if (component && component.blocksMovement) {
                    blockingActor = actor;
                    break;
                }
            }
        }

        return blockingActor;
    }

    addPlayer(x, y, z = 1) {
        const position = {
            components: {
                positionalobject: {
                    x: x,
                    y: y,
                    z: z}
            }
        };
        engine.player = entityLoader.createFromTemplate('Player', position);
        engine.gameMap.actors.push(engine.player);
        const positionalObject = engine.player.getComponent("positionalobject");
        positionalObject.setVisible();
        sceneState.updateCameraPosition(engine.player);

        const playerFighter = engine.player.getComponent("fighter");
        characterHealth.update(playerFighter.hp, playerFighter.maxHp);
        characterMana.update(playerFighter.mana, playerFighter.maxMana);
        details.updatePlayerDetails();
    }
}