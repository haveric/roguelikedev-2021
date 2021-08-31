import ArrayUtil from "../util/ArrayUtil";
import sceneState from "../SceneState";
import entityLoader from "../entity/EntityLoader";
import engine from "../Engine";
import Tile from "../entity/Tile";
import Fov from "../components/Fov";
import characterHealth from "../ui/CharacterHealth";
import details from "../ui/Details";
import characterMana from "../ui/CharacterMana";
import Actor from "../entity/Actor";
import Remnant from "../components/Remnant";
import inventory from "../ui/Inventory";
import {Vector3} from "three"; // eslint-disable-line no-unused-vars
import Item from "../entity/Item";
import bottomContainer from "../ui/BottomContainer";

export default class GameMap {
    constructor(name, width, height) {
        this.name = name;
        this.width = width;
        this.height = height;

        this.timeout = null;
        this.saveCache = null;

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

    create() {}

    teardown() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

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

    removeEntity(entity) {
        if (entity instanceof Actor) {
            this.removeActor(entity);
        } else if (entity instanceof Item) {
            this.removeItem(entity);
        }
    }

    removeItem(item) {
        const index = this.items.indexOf(item);
        if (index > -1) {
            this.items.splice(index, 1);
        }
    }

    /**
     *
     * @param item
     * @param groundPosition
     * @returns {boolean} true if item added <br/>
     *                    false if item merged and item is deleted
     */
    addItem(item, groundPosition) {
        const itemPosition = item.getComponent("positionalobject");
        if (!groundPosition) {
            groundPosition = itemPosition;
        }

        let amountToAdd = item.amount;
        for (const mapItem of this.items) {
            if (mapItem.id === item.id) {
                const position = mapItem.getComponent("positionalobject");
                const remnant = mapItem.getComponent("remnant");
                if (position && groundPosition.isSamePosition(position) && (!remnant || !remnant.isRemnant)) {
                    if (mapItem.maxStackSize === -1) {
                        mapItem.setAmount(mapItem.amount + item.amount);
                        itemPosition.teardown();
                        return false;
                    }

                    const amountCanAdd = mapItem.maxStackSize - mapItem.amount;
                    if (amountCanAdd >= amountToAdd) {
                        mapItem.setAmount(mapItem.amount + amountToAdd);
                        itemPosition.teardown();
                        return false;
                    } else {
                        mapItem.setAmount(mapItem.amount + amountCanAdd);
                        item.setAmount(item.amount - amountCanAdd);

                        amountToAdd -= amountCanAdd;
                    }
                }
            }
        }

        if (amountToAdd > 0) {
            item.setAmount(amountToAdd);

            itemPosition.moveTo(groundPosition.x, groundPosition.y, groundPosition.z, false);
            item.parent = null;
            this.items.push(item);
            itemPosition.setVisible();
            return true;
        } else {
            itemPosition.teardown();
            return false;
        }
    }

    removeActor(actor) {
        const index = this.actors.indexOf(actor);
        if (index > -1) {
            this.actors.splice(index, 1);
        }
    }

    save() {
        if (engine.gameMap !== this && this.saveCache) {
            return this.saveCache;
        }

        const saveData = {
            name: this.name,
            width: this.width,
            height: this.height
        };

        saveData["tiles"] = {};
        const entries = this.tiles.entries();
        for (const entry of entries) {
            const tileArray = [];
            const letterArray = [];
            let key = "";
            let charCode = 65;

            for (let i = 0; i < this.width; i++) {
                for (let j = 0; j < this.height; j++) {
                    const tile = entry[1][i][j];
                    if (tile) {
                        const tileJson = JSON.stringify(tile.save());
                        const index = tileArray.indexOf(tileJson);
                        if (index > -1) {
                            key += letterArray[index];
                        } else {
                            tileArray.push(tileJson);
                            letterArray.push(String.fromCharCode(charCode));
                            key += String.fromCharCode(charCode);

                            charCode++;
                        }
                    } else {
                        key += " ";
                    }
                }
            }

            const mapKey = entry[0];
            saveData["tiles"][mapKey] = {};
            saveData["tiles"][mapKey]["key"] = key;
            saveData["tiles"][mapKey]["map"] = {};

            for (let i = 0; i < tileArray.length; i++) {
                saveData["tiles"][mapKey]["map"][letterArray[i]] = tileArray[i];
            }
        }

        const actorJson = [];
        for (const actor of this.actors) {
            actorJson.push(JSON.stringify(actor.save()));
        }
        saveData["actors"] = actorJson;

        const itemJson = [];
        for (const item of this.items) {
            itemJson.push(JSON.stringify(item.save()));
        }
        saveData["items"] = itemJson;

        this.saveCache = saveData;
        return saveData;
    }

    load(json) {
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
            this.actors.push(createdActor);
        }

        const items = json.items;
        for (const item of items) {
            const createdItem = entityLoader.create(item);
            this.items.push(createdItem);
        }
    }

    isInBounds(x, y) {
        return 0 <= x && x < this.width && 0 <= y && y < this.height;
    }

    revealPreviouslyExplored() {
        const tileIter = this.tiles.entries();
        for (const entry of tileIter) {
            for (let i = 0; i < this.width; i++) {
                for (let j = 0; j < this.height; j++) {
                    const tile = entry[1][i][j];
                    if (tile) {
                        const position = tile.getComponent("positionalobject");
                        if (position && !position.isVisible()) {
                            const fov = tile.getComponent("fov");
                            if (fov && fov.explored) {
                                position.setVisible();
                                this.setTransparency(position, -5, -5, position.z);
                                position.shiftColor(.5);
                            }
                        }
                    }
                }
            }
        }

        for (const entity of this.items) {
            const remnant = entity.getComponent("remnant");
            if (remnant && remnant.isRemnant) {
                const position = entity.getComponent("positionalobject");
                position.setVisible();
                position.shiftColor(.5);
            }
        }

        for (const entity of this.actors) {
            const remnant = entity.getComponent("remnant");
            if (remnant && remnant.isRemnant) {
                const position = entity.getComponent("positionalobject");
                position.setVisible();
                position.shiftColor(.5);
            }
        }
    }

    revealFromPosition(x, y, radius, delay = 25) {
        const self = this;
        const minX = Math.max(0, x - radius);
        const maxX = Math.min(engine.gameMap.width, x + radius);
        const minY = Math.max(0, y - radius);
        const maxY = Math.min(engine.gameMap.height, y + radius);

        if (delay === 0) {
            self._revealGradually(minX, maxX, minY, maxY, x, y, 1, radius, delay);
        } else {
            self.timeout = setTimeout(function () {
                self._revealGradually(minX, maxX, minY, maxY, x, y, 1, radius, delay);
            }, delay);
        }
    }

    _revealGradually(minX, maxX, minY, maxY, x, y, radius, maxRadius, delay) {
        const self = this;
        self.timeout = null;

        if (radius <= maxRadius) {
            self.timeout = setTimeout(function () {
                self._revealGradually(minX, maxX, minY, maxY, x, y, radius + 1, maxRadius, delay);
            }, delay);
        }

        const xRadiusMin = x - radius;
        const xRadiusMax = x + radius;
        const yRadiusMin = y - radius;
        const yRadiusMax = y + radius;
        for (let i = xRadiusMin; i <= xRadiusMax; i++) {
            const xIsEdge = i === xRadiusMin || i === xRadiusMax;
            for (let j = yRadiusMin; j <= yRadiusMax; j++) {
                if (xIsEdge || j === yRadiusMin || j === yRadiusMax) {
                    this._revealAtPosition(i, j);
                    engine.needsMapUpdate = true;
                }
            }
        }

        if (xRadiusMin <= minX && xRadiusMax >= maxX && yRadiusMin <= minY && yRadiusMax >= maxY) {
            return true;
        }

        return true;
    }

    _revealAtPosition(x, y) {
        const tileIter = this.tiles.entries();
        for (const entry of tileIter) {
            const tileX = entry[1][x];
            if (tileX) {
                const tile = entry[1][x][y];
                if (tile) {
                    const position = tile.getComponent("positionalobject");
                    if (position && !position.isVisible()) {
                        position.setVisible();
                        this.setTransparency(position, -5, -5, position.z);
                        position.shiftColor(.5);

                        const fov = tile.getComponent("fov");
                        if (!fov) {
                            tile.setComponent(new Fov({components: {fov: {explored: true, visible: false}}}));
                        }
                    }
                }
            }
        }


        for (const entity of this.items) {
            const remnant = entity.getComponent("remnant");
            if (remnant && remnant.isRemnant) {
                const position = entity.getComponent("positionalobject");
                if (position && position.x === x && position.y === y) {
                    entity.getComponent("positionalobject").teardown();
                }
            }
        }

        for (const entity of this.actors) {
            const remnant = entity.getComponent("remnant");
            if (remnant && remnant.isRemnant) {
                const position = entity.getComponent("positionalobject");
                if (position && position.x === x && position.y === y) {
                    entity.getComponent("positionalobject").teardown();
                }
            }
        }

        for (const entity of this.items) {
            const remnant = entity.getComponent("remnant");
            if (!remnant || !remnant.isRemnant) {
                const position = entity.getComponent("positionalobject");
                if (position && position.x === x && position.y === y && !position.isVisible()) {
                    const remnant = entity.clone();
                    remnant.setName("Sighting of " + remnant.name);
                    remnant.removeComponent("ai");
                    remnant.removeComponent("blocksMovement");
                    remnant.removeComponent("blocksFov");
                    remnant.setComponent(new Remnant({
                        components: {
                            remnant: {
                                isRemnant: true,
                                x: position.x,
                                y: position.y,
                                z: position.z
                            }
                        }
                    }));

                    const remnantPosition = remnant.getComponent("positionalobject");
                    remnantPosition.setVisible();
                    remnantPosition.shiftColor(.5);
                    if (entity instanceof Actor) {
                        this.actors.push(remnant);
                    } else {
                        this.items.push(remnant);
                    }

                    entity.setComponent(new Remnant({
                        components: {
                            remnant: {
                                isRemnant: false,
                                x: position.x,
                                y: position.y,
                                z: position.z
                            }
                        }
                    }));
                    position.setVisible(false);

                    entity.callEvent("onCreateRemnant");
                }
            }
        }

        for (const entity of this.actors) {
            const remnant = entity.getComponent("remnant");
            if (!remnant || !remnant.isRemnant) {
                const position = entity.getComponent("positionalobject");
                if (position && position.x === x && position.y === y && !position.isVisible()) {
                    const remnant = entity.clone();
                    remnant.setName("Sighting of " + remnant.name);
                    remnant.removeComponent("ai");
                    remnant.removeComponent("blocksMovement");
                    remnant.removeComponent("blocksFov");
                    remnant.setComponent(new Remnant({
                        components: {
                            remnant: {
                                isRemnant: true,
                                x: position.x,
                                y: position.y,
                                z: position.z
                            }
                        }
                    }));

                    const remnantPosition = remnant.getComponent("positionalobject");
                    remnantPosition.setVisible();
                    remnantPosition.shiftColor(.5);
                    if (entity instanceof Actor) {
                        this.actors.push(remnant);
                    } else {
                        this.items.push(remnant);
                    }

                    entity.setComponent(new Remnant({
                        components: {
                            remnant: {
                                isRemnant: false,
                                x: position.x,
                                y: position.y,
                                z: position.z
                            }
                        }
                    }));
                    position.setVisible(false);

                    entity.callEvent("onCreateRemnant");
                }
            }
        }
    }

    reveal() {
        const tileIter = this.tiles.entries();
        for (const entry of tileIter) {
            for (let i = 0; i < this.width; i++) {
                for (let j = 0; j < this.height; j++) {
                    const tile = entry[1][i][j];
                    if (tile) {
                        const position = tile.getComponent("positionalobject");
                        if (position && !position.isVisible()) {
                            position.setVisible();
                            this.setTransparency(position, -5, -5, position.z);
                            position.shiftColor(.5);

                            const fov = tile.getComponent("fov");
                            if (!fov) {
                                tile.setComponent(new Fov({components: {fov: {explored: true, visible: false}}}));
                            }
                        }
                    }
                }
            }
        }

        for (const entity of this.items) {
            const remnant = entity.getComponent("remnant");
            if (remnant && remnant.isRemnant) {
                entity.getComponent("positionalobject").teardown();
            }
        }

        for (const entity of this.actors) {
            const remnant = entity.getComponent("remnant");
            if (remnant && remnant.isRemnant) {
                entity.getComponent("positionalobject").teardown();
            }
        }

        for (const entity of this.items) {
            const remnant = entity.getComponent("remnant");
            if (!remnant || !remnant.isRemnant) {
                const position = entity.getComponent("positionalobject");
                if (position && !position.isVisible()) {
                    const remnant = entity.clone();
                    remnant.setName("Sighting of " + remnant.name);
                    remnant.removeComponent("ai");
                    remnant.removeComponent("blocksMovement");
                    remnant.removeComponent("blocksFov");
                    remnant.setComponent(new Remnant({
                        components: {
                            remnant: {
                                isRemnant: true,
                                x: position.x,
                                y: position.y,
                                z: position.z
                            }
                        }
                    }));

                    const remnantPosition = remnant.getComponent("positionalobject");
                    remnantPosition.setVisible();
                    remnantPosition.shiftColor(.5);
                    if (entity instanceof Actor) {
                        this.actors.push(remnant);
                    } else {
                        this.items.push(remnant);
                    }

                    entity.setComponent(new Remnant({
                        components: {
                            remnant: {
                                isRemnant: false,
                                x: position.x,
                                y: position.y,
                                z: position.z
                            }
                        }
                    }));
                    position.setVisible(false);

                    entity.callEvent("onCreateRemnant");
                }
            }
        }

        for (const entity of this.actors) {
            const remnant = entity.getComponent("remnant");
            if (!remnant || !remnant.isRemnant) {
                const position = entity.getComponent("positionalobject");
                if (position && !position.isVisible()) {
                    const remnant = entity.clone();
                    remnant.setName("Sighting of " + remnant.name);
                    remnant.removeComponent("ai");
                    remnant.removeComponent("blocksMovement");
                    remnant.removeComponent("blocksFov");
                    remnant.setComponent(new Remnant({
                        components: {
                            remnant: {
                                isRemnant: true,
                                x: position.x,
                                y: position.y,
                                z: position.z
                            }
                        }
                    }));

                    const remnantPosition = remnant.getComponent("positionalobject");
                    remnantPosition.setVisible();
                    remnantPosition.shiftColor(.5);
                    if (entity instanceof Actor) {
                        this.actors.push(remnant);
                    } else {
                        this.items.push(remnant);
                    }

                    entity.setComponent(new Remnant({
                        components: {
                            remnant: {
                                isRemnant: false,
                                x: position.x,
                                y: position.y,
                                z: position.z
                            }
                        }
                    }));
                    position.setVisible(false);

                    entity.callEvent("onCreateRemnant");
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
            if (newObject instanceof Tile) {
                const fovComponent = newObject.getComponent("fov");
                if (fovComponent) {
                    fovComponent.setExplored(true);
                    fovComponent.setVisible(true);
                } else {
                    newObject.setComponent(new Fov({components: {fov: {explored: true, visible: true}}}));
                }
            } else if (newObject instanceof Item) {
                const remnant = newObject.getComponent("remnant");
                if (remnant && remnant.isRemnant) {
                    const position = newObject.getComponent("positionalobject");
                    if (position) {
                        position.teardown();
                    }
                    this.removeItem(newObject);

                    newObjectsRemoved.push(newObject);

                    fov.removeVisible(newObject);
                }
            } else if (newObject instanceof Actor) {
                const remnant = newObject.getComponent("remnant");
                if (remnant) {
                    if (remnant.isRemnant) {
                        newObject.getComponent("positionalobject").teardown();
                        this.removeActor(newObject);

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
                                                const itemPosition = item.getComponent("positionalobject");
                                                if (itemPosition) {
                                                    itemPosition.teardown();
                                                }
                                                newObjectsRemoved.push(item);
                                                fov.removeVisible(item);
                                            }
                                        }
                                    }

                                    for (const item of itemsRemoved) {
                                        this.removeItem(item);
                                    }

                                    break;
                                }
                            }
                        }

                        for (const actor of actorsRemoved) {
                            this.removeActor(actor);
                        }

                        newObject.removeComponent("remnant");
                    }
                }
            }
        }

        for (const newObject of newObjectsRemoved) {
            const newIndex = newObjects.indexOf(newObject);
            if (newIndex > -1) {
                newObjects.splice(newIndex, 1);
            }
        }

        for (const object of fov.previousVisibleObjects) {
            const index = fov.visibleObjects.indexOf(object);
            if (index === -1) {
                const fovComponent = object.getComponent("fov");
                if (fovComponent) {
                    fovComponent.setVisible(false);
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
            if (visibleObject instanceof Tile) {
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
                const isActor = oldObject instanceof Actor;
                if (isActor || oldObject instanceof Item) {
                    const remnant = oldObject.clone();
                    remnant.setName("Sighting of " + remnant.name);
                    remnant.removeComponent("ai");
                    remnant.removeComponent("blocksMovement");
                    remnant.removeComponent("blocksFov");
                    remnant.setComponent(new Remnant({components: {remnant: {isRemnant: true, x: position.x, y: position.y, z: position.z}}}));

                    const remnantPosition = remnant.getComponent("positionalobject");
                    remnantPosition.setVisible();
                    remnantPosition.shiftColor(.5);
                    if (isActor) {
                        this.actors.push(remnant);
                    } else {
                        this.items.push(remnant);
                    }

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
        if (!engine.player) {
            engine.player = entityLoader.createFromTemplate("player");
        }

        this.actors.push(engine.player);

        const positionalObject = engine.player.getComponent("positionalobject");
        positionalObject.x = x;
        positionalObject.y = y;
        positionalObject.z = z;
        positionalObject.setVisible();
        sceneState.updateCameraPosition(engine.player);

        this.updatePlayerUI();
    }

    updatePlayerUI() {
        const playerFighter = engine.player.getComponent("fighter");
        bottomContainer.updateAll();
        characterHealth.update(playerFighter.hp, playerFighter.maxHp);
        characterMana.update(playerFighter.mana, playerFighter.maxMana);
        details.updatePlayerDetails();
        inventory.populateInventory(engine.player);
    }
}