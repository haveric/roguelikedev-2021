import GameMap from "./GameMap";
import engine from "../Engine";
import entityLoader from "../entity/EntityLoader";
import sceneState from "../SceneState";
import MapLayer from "./MapLayer";
import Shop from "./room/Shop";
import ArrayUtil from "../util/ArrayUtil";

export default class Town extends GameMap {
    constructor() {
        super(40, 40);
    }

    init() {
        this.tiles = new Map();
        for (let i = -1; i < 10; i++) {
            this.tiles.set(i, ArrayUtil.create2dArray(this.width));
        }

        this.actors = [];
        this.items = [];
    }

    create() {
        super.create();

        const newRoom = new Shop(8, 8, 6, 8);
        newRoom.createRoom(this);

        // Fill rest of floors
        for (let j = 5; j < this.height - 5; j++) {
            for (let i = 5; i < this.width - 5; i++) {
                const floorTile = this.tiles.get(MapLayer.Floor)[i][j];
                if (!floorTile) {
                    this.tiles.get(-1)[i][j] = entityLoader.createFromTemplate('Floor', {components: {positionalobject: {x: i, y: j, z: -1}}});
                    if (i >= 23 && i <= 25 && j >= 7 && j <= 10) {
                        this.tiles.get(MapLayer.Floor)[i][j] = entityLoader.createFromTemplate('Water', {components: {positionalobject: {x: i, y: j, z: 0}}});
                    } else {
                        this.tiles.get(MapLayer.Floor)[i][j] = entityLoader.createFromTemplate('Grass Floor', {components: {positionalobject: {x: i, y: j, z: 0}}});
                    }

                    if (i > 17 && i < 21 && j === 7) {
                        this.tiles.get(MapLayer.Wall)[i][j] = entityLoader.createFromTemplate('Bench', {components: {positionalobject: {x: i, y: j, z: 1}}});
                    } else if (i === 21 && j === 7) {
                        this.tiles.get(MapLayer.Wall)[i][j] = entityLoader.createFromTemplate('Bench Armrest Right', {components: {positionalobject: {x: i, y: j, z: 1}}});
                    } else if (i === 17 && j === 7) {
                        this.tiles.get(MapLayer.Wall)[i][j] = entityLoader.createFromTemplate('Bench Armrest Left', {components: {positionalobject: {x: i, y: j, z: 1}}});
                    } else if (i > 17 && i < 21 && j === 10) {
                        this.tiles.get(MapLayer.Wall)[i][j] = entityLoader.createFromTemplate('Stone Bench', {components: {positionalobject: {x: i, y: j, z: 1}}});
                    } else {
                        const floor = this.tiles.get(MapLayer.Floor)[i][j];
                        if (floor.components.walkable && floor.components.walkable.walkable) {
                            if (Math.random() < .01) {
                                this.createTree(i, j);
                            } else if (Math.random() < .05) {
                                this.tiles.get(MapLayer.Wall)[i][j] = entityLoader.createFromTemplate('Stone', {components: {positionalobject: {x: i, y: j, z: 1}}});
                            } else {
                                if (Math.random() < .3) {
                                    this.tiles.get(MapLayer.Wall)[i][j] = entityLoader.createFromTemplate('Grass', {components: {positionalobject: {x: i, y: j, z: 1}}});
                                }
                            }
                        }
                    }
                }
            }
        }

        this.addPlayer(6, 6);
    }

    createTree(x, y) {
        for (let z = 1; z <= 8; z++) {
            this.tiles.get(z)[x][y] = entityLoader.createFromTemplate('Tree Trunk', {components: {positionalobject: {x: x, y: y, z: z}}});
        }

        for (let z = 5; z < 10; z++) {
            for (let i = -2; i <= 2; i++) {
                for (let j = -2; j <= 2; j++) {
                    if (i !== 0 || j !== 0) {
                        const absI = Math.abs(i);
                        const absJ = Math.abs(j);
                        if ((absI === 2 || absJ === 2)) {
                            // Skip corners
                            if (absI === 2 && absJ === 2) {
                                continue;
                            }

                            // Skip top and bottom outsides
                            if ((z === 5 || z === 9)) {
                                continue;
                            }

                            // Skip some leaves
                            if (Math.random() < .1) {
                                continue;
                            }
                        }

                        if (this.tiles.get(z)[x+i]) {
                            this.tiles.get(z)[x+i][y+j] = entityLoader.createFromTemplate('Tree Leaves', {components: {positionalobject: {x: x+i, y: y+j, z: z}}});
                        }
                    }
                }
            }
        }

        this.tiles.get(9)[x][y] = entityLoader.createFromTemplate('Tree Leaves', {components: {positionalobject: {x: x, y: y, z: 9}}});
    }
}