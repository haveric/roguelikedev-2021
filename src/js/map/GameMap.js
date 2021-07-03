import ArrayUtil from "../util/ArrayUtil";
import MapLayer from "./MapLayer";
import CharacterTile from "../entity/CharacterTile";
import SolidTile from "../entity/SolidTile";
import sceneState from "../SceneState";
import entityLoader from "../entity/EntityLoader";
import gameState from "../GameState";

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
        this.tiles.set(MapLayer.Decorative, ArrayUtil.create2dArray(this.width));

        this.actors = [];
        this.items = [];
    }

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

    createTestMap() {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                let tile;
                if (j === 5 || i === 5) {
                    this.tiles.get(MapLayer.Wall)[i][j] = new CharacterTile({name: "Wall", x: i, y: j, z: 1, scale: 1, letter: "#", color: 0x666666});
                }

                if (i === 12 && j === 12) {
                    this.tiles.get(MapLayer.Wall)[i][j] = new CharacterTile({name: "Door", x: i, y: j, z: 1, scale: 1, letter: "+", color: 0x964b00});
                }

                if (j === 3 || i === 3) {
                    tile = new CharacterTile({name: "Water", x: i, y: j, z: 0, scale: .7, letter: "≈", color: 0x3333cc});
                } else {
                    tile = new SolidTile({name: "Floor", x: i, y: j, z: 0, scale: 1, color: 0x333333});
                }

                this.tiles.get(MapLayer.Floor)[i][j] = tile;
            }
        }
    }

    save(name) {
        let saveData = {
            width: this.width,
            height: this.height
        };

        const floorTiles = this.tiles.get(MapLayer.Floor);
        const wallTiles = this.tiles.get(MapLayer.Wall);
        const decorativeTiles = this.tiles.get(MapLayer.Decorative);

        const floorMap = new Map();
        let floorKey = "";
        let floorCharCode = 65;

        const wallMap = new Map();
        let wallKey = "";
        let wallCharCode = 65;

        const decorativeMap = new Map();
        let decorativeKey = "";
        let decorativeCharCode = 65;

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                const floorTile = floorTiles[i][j];
                if (floorTile) {
                    const floorTileJson = JSON.stringify(floorTile.save());
                    if (!floorMap.has(floorTileJson)) {
                        floorMap.set(floorTileJson, floorCharCode);
                    }
                    floorKey += String.fromCharCode(floorMap.get(floorTileJson));
                    floorCharCode++;
                    if (String.fromCharCode(floorCharCode) === ' ') {
                        floorCharCode++;
                    }
                } else {
                    floorKey += ' ';
                }


                const wallTile = wallTiles[i][j];
                if (wallTile) {
                    const wallTileJson = JSON.stringify(wallTile.save());
                    if (!wallMap.has(wallTileJson)) {
                        wallMap.set(wallTileJson, wallCharCode);
                    }
                    wallKey += String.fromCharCode(wallMap.get(wallTileJson));
                    wallCharCode++;
                    if (String.fromCharCode(wallCharCode) === ' ') {
                        wallCharCode++;
                    }
                } else {
                    wallKey += ' ';
                }

                const decorativeTile = decorativeTiles[i][j];
                if (decorativeTile) {
                    const decorativeTileJson = JSON.stringify(decorativeTile.save());
                    if (!decorativeMap.has(decorativeTileJson)) {
                        decorativeMap.set(decorativeTileJson, decorativeCharCode);
                    }
                    decorativeKey += String.fromCharCode(decorativeMap.get(decorativeTileJson));
                    decorativeCharCode++;
                    if (String.fromCharCode(decorativeCharCode) === ' ') {
                        decorativeCharCode++;
                    }
                } else {
                    decorativeKey += ' ';
                }
            }
        }

        saveData["floorMap"] = {};
        const floorIter = floorMap.entries();
        for (const entry of floorIter) {
            saveData["floorMap"][String.fromCharCode(entry[1])] = entry[0];
        }
        saveData["floor"] = floorKey;
        saveData["wallMap"] = {};
        const wallIter = wallMap.entries();
        for (const entry of wallIter) {
            saveData["wallMap"][String.fromCharCode(entry[1])] = entry[0];
        }
        saveData["wall"] = wallKey;
        saveData["decorativeMap"] = {};
        const decorativeIter = decorativeMap.entries();
        for (const entry of decorativeIter) {
            saveData["decorativeMap"][String.fromCharCode(entry[1])] = entry[0];
        }
        saveData["decorative"] = decorativeKey;

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

            const floorMap = json.floorMap;
            const floor = json.floor;
            const wallMap = json.wallMap;
            const wall = json.wall;
            const decorativeMap = json.decorativeMap;
            const decorative = json.decorative;

            const floorTiles = this.tiles.get(MapLayer.Floor);
            const wallTiles = this.tiles.get(MapLayer.Wall);
            const decorativeTiles = this.tiles.get(MapLayer.Decorative);
            for (let i = 0; i < this.width; i++) {
                for (let j = 0; j < this.height; j++) {
                    const index = i*this.width + j;
                    const floorTile = floorMap[floor[index]];
                    if (floorTile) {
                        floorTiles[i][j] = entityLoader.create(floorTile, {x: i, y: j, z: MapLayer.Floor});
                    }

                    const wallTile = wallMap[wall[index]];
                    if (wallTile) {
                        wallTiles[i][j] = entityLoader.create(wallTile, {x: i, y: j, z: MapLayer.Wall});
                    }

                    const decorativeTile = decorativeMap[decorative[index]];
                    if (decorativeTile) {
                        decorativeTiles[i][j] = entityLoader.create(decorativeTile, {x: i, y: j, z: MapLayer.Decorative});
                    }
                }
            }

            const actors = json.actors;
            for (const actor of actors) {
                const createdActor = entityLoader.create(actor);
                if (createdActor.name === 'Player') {
                    gameState.player = createdActor;
                }
                this.actors.push(createdActor);
            }
            const items = json.items;
            for (const item of items) {
                const createdItem = entityLoader.create(item);
                this.items.push(createdItem);
            }

            const positionalObject = gameState.player.getComponent("positionalobject");
            positionalObject.setVisible(true);
            sceneState.updateCameraPosition(gameState.player);
        }
    }

    draw(x, y, range) {
        const left = Math.max(0, x - range);
        const right = Math.min(this.width, x + range);
        const top = Math.max(0, y - range);
        const bottom = Math.min(this.height, y + range);

        for (let i = left; i < right; i++) {
            for (let j = top; j < bottom; j++) {
                const tile = this.tiles.get(MapLayer.Floor)[i][j];
                if (tile) {
                    const tileObject = tile.getComponent("positionalobject");
                    if (tileObject && !tileObject.isVisible()) {
                        tileObject.setVisible(true);
                        sceneState.scene.add(tileObject.object);
                    }
                }

                const wallTile = this.tiles.get(MapLayer.Wall)[i][j];
                if (wallTile) {
                    const wallTileObject = wallTile.getComponent("positionalobject");
                    if (wallTileObject && !wallTileObject.isVisible()) {
                        wallTileObject.setVisible(true);
                        sceneState.scene.add(wallTileObject.object);
                    }
                }
            }
        }

        for (let actor of this.actors) {
            const positionalObject = actor.getComponent("positionalobject");
            if (positionalObject) {
                if (Math.abs(positionalObject.x - x) <= range && Math.abs(positionalObject.y - y) <= range) {
                    positionalObject.setVisible(true);
                } else {
                    positionalObject.setVisible(false);
                }
            }
        }

        for (let item of this.items) {
            const positionalObject = item.getComponent("positionalobject");
            if (positionalObject) {
                if (Math.abs(positionalObject.x - x) <= range && Math.abs(positionalObject.y - y) <= range) {
                    positionalObject.setVisible(true);
                } else {
                    positionalObject.setVisible(false);
                }
            }
        }
    }
}