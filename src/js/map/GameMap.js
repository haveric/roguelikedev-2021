import ArrayUtil from "../util/ArrayUtil";
import sceneState from "../SceneState";
import entityLoader from "../entity/EntityLoader";
import engine from "../Engine";
import _Tile from "../entity/_Tile";
import Fov from "../components/Fov";
import characterHealth from "../ui/CharacterHealth";
import details from "../ui/Details";
import characterMana from "../ui/CharacterMana";
import Actor from "../entity/Actor";
import Remnant from "../components/Remnant";
import inventory from "../ui/Inventory";
import {Vector3} from "three";
import Item from "../entity/Item";

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
                        tile.callEvent("onMapTeardown");
                    }
                }
            }
        }

        for (const actor of this.actors) {
            actor.callEvent("onMapTeardown");
        }

        for (const item of this.items) {
            item.callEvent("onMapTeardown");
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

            this.updatePlayerUI();
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

        const newObjectsRemoved = [];
        for (const newObject of newObjects) {
            if (newObject instanceof _Tile) {
                const fovComponent = newObject.getComponent("fov");
                if (fovComponent) {
                    fovComponent.explored = true;
                    fovComponent.visible = true;
                } else {
                    newObject.setComponent(new Fov({components: {fov: {explored: true, visible: true}}}));
                }
            } else if (newObject instanceof Item) {
                const remnant = newObject.getComponent("remnant");
                if (remnant && remnant.isRemnant) {
                    newObject.getComponent("positionalobject").teardown();
                    const index = this.items.indexOf(newObject);
                    if (index > -1) {
                        this.items.splice(index, 1);
                    }

                    newObjectsRemoved.push(newObject);

                    const visibleIndex = fov.visibleObjects.indexOf(newObject);
                    if (visibleIndex > -1) {
                        fov.visibleObjects.splice(visibleIndex, 1);
                    }

                    const visibleItemsIndex = fov.visibleItems.indexOf(newObject);
                    if (visibleItemsIndex > -1) {
                        fov.visibleItems.splice(visibleIndex, 1);
                    }

                    const previousVisibleItemsIndex = fov.previousVisibleObjects.indexOf(newObject);
                    if (previousVisibleItemsIndex > -1) {
                        fov.previousVisibleObjects.splice(previousVisibleItemsIndex, 1);
                    }
                }
            } else if (newObject instanceof Actor) {
                const remnant = newObject.getComponent("remnant");
                if (remnant) {
                    if (remnant.isRemnant) {
                        newObject.getComponent("positionalobject").teardown();
                        const index = this.actors.indexOf(newObject);
                        if (index > -1) {
                            this.actors.splice(index, 1);
                        }

                        newObjectsRemoved.push(newObject);

                        const visibleIndex = fov.visibleObjects.indexOf(newObject);
                        if (visibleIndex > -1 ) {
                            fov.visibleObjects.splice(visibleIndex, 1);
                        }
                    } else {
                        const actorsRemoved = [];
                        // Remove remnant of now visible actor
                        for (const actor of this.actors) {
                            if (actor === newObject) {
                                continue;
                            }

                            const actorRemnant = actor.getComponent("remnant");
                            if (actorRemnant && actorRemnant.isRemnant) {
                                if (remnant.x === actorRemnant.x && remnant.y === actorRemnant.y && remnant.z === actorRemnant.z) {
                                    actor.getComponent("positionalobject").teardown();
                                    actorsRemoved.push(actor);

                                    newObjectsRemoved.push(actor);

                                    const visibleIndex = fov.visibleObjects.indexOf(actor);
                                    if (visibleIndex > -1 ) {
                                        fov.visibleObjects.splice(visibleIndex, 1);
                                    }

                                    actor.callEvent("onDestroyRemnant");

                                    const itemsRemoved = [];
                                    for (const item of this.items) {
                                        const itemRemnant = item.getComponent("remnant");
                                        if (itemRemnant && itemRemnant.isRemnant) {
                                            if (remnant.x === itemRemnant.x && remnant.y === itemRemnant.y && remnant.z === itemRemnant.z) {
                                                itemsRemoved.push(item);
                                                item.getComponent("positionalobject").teardown();
                                                item.removeComponent("positionalobject");

                                                newObjectsRemoved.push(item);

                                                const visibleIndex = fov.visibleObjects.indexOf(item);
                                                if (visibleIndex > -1 ) {
                                                    fov.visibleObjects.splice(visibleIndex, 1);
                                                }

                                                const visibleItemsIndex = fov.visibleItems.indexOf(item);
                                                if (visibleItemsIndex > -1) {
                                                    fov.visibleItems.splice(visibleItemsIndex, 1);
                                                }

                                                const previousVisibleItemsIndex = fov.previousVisibleObjects.indexOf(item);
                                                if (previousVisibleItemsIndex > -1) {
                                                    fov.previousVisibleObjects.splice(previousVisibleItemsIndex, 1);
                                                }
                                            }
                                        }
                                    }

                                    for (const item of itemsRemoved) {
                                        const index = this.items.indexOf(item);
                                        if (index > -1) {
                                            this.items.splice(index, 1);
                                        }
                                    }

                                    break;
                                }
                            }
                        }

                        for (const actor of actorsRemoved) {
                            const index = this.actors.indexOf(actor);
                            if (index > -1) {
                                this.actors.splice(index, 1);
                            }
                        }

                        newObject.removeComponent("remnant");
                    }
                }
            }
        }

        for (let newObject of newObjectsRemoved) {
            const newIndex = newObjects.indexOf(newObject);
            if (newIndex > -1) {
                delete newObjects[newIndex];
                newObjects.splice(newIndex, 1);
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
                } else {
                    object.resetColor();
                }
            }

            newObject.callEvent("onAddToScene");
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
            const position = oldObject.getComponent("positionalobject");
            if (position) {
                if (oldObject instanceof Actor && oldObject.isAlive()) {
                    const remnant = oldObject.clone();
                    remnant.name = "Sighting of " + remnant.name;
                    remnant.removeComponent("ai");
                    remnant.removeComponent("blocksMovement");
                    remnant.removeComponent("blocksFov");
                    remnant.setComponent(new Remnant({components: {remnant: {isRemnant: true, x: position.x, y: position.y, z: position.z}}}));

                    const remnantPosition = remnant.getComponent("positionalobject");
                    remnantPosition.setVisible();
                    remnantPosition.shiftColor(.5);
                    this.actors.push(remnant);

                    oldObject.setComponent(new Remnant({components: {remnant: {isRemnant: false, x: position.x, y: position.y, z: position.z}}}));
                    position.setVisible(false);

                    oldObject.callEvent("onCreateRemnant");
                } else {
                    this.setTransparency(position, x, y, z);

                    if (position.hasObject()) {
                        position.shiftColor(.5);
                    }
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

    /**
     * @param {Vector3} location
     */
    getAliveActorAtLocation(location) {
        let aliveActor = null;
        for (const actor of this.actors) {
            if (actor.isAlive()) {
                const position = actor.getComponent("positionalobject");
                if (position && location.x === position.x && location.y === position.y && location.z === position.z) {
                    aliveActor = actor;
                    break;
                }
            }
        }

        return aliveActor;
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

    /**
     *
     * @param {Vector3} position
     */
    isPositionVisible(position) {
        let isVisible = false;

        for (let z = position.z - 1; z <= position.z + 1; z++) {
            const tiles = this.tiles.get(position.z);
            if (tiles) {
                const tileX = tiles[position.x];
                if (tileX) {
                    const tile = tileX[position.y];
                    if (tile) {
                        const fov = tile.getComponent("fov");
                        if (fov) {
                            if (fov.visible) {
                                isVisible = true;
                                break;
                            }
                        }
                    }
                }
            }
        }


        return isVisible;
    }

    addPlayer(x, y, z = 1) {
        const position = {
            components: {
                positionalobject: {x: x, y: y, z: z}
            }
        };
        engine.player = entityLoader.createFromTemplate('player', position);
        engine.gameMap.actors.push(engine.player);
        const positionalObject = engine.player.getComponent("positionalobject");
        positionalObject.setVisible();
        sceneState.updateCameraPosition(engine.player);

        this.updatePlayerUI();
    }

    updatePlayerUI() {
        const playerFighter = engine.player.getComponent("fighter");
        characterHealth.update(playerFighter.hp, playerFighter.maxHp);
        characterMana.update(playerFighter.mana, playerFighter.maxMana);
        details.updatePlayerDetails();
        inventory.populateInventory(engine.player);
    }
}