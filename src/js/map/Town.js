import GameMap from "./GameMap";
import entityLoader from "../entity/EntityLoader";
import MapLayer from "./MapLayer";
import Shop from "./room/Shop";
import ArrayUtil from "../util/ArrayUtil";
import {MathUtils} from "three";
import Forge from "./room/Forge";

export default class Town extends GameMap {
    constructor() {
        super("town", 65, 70);
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

        const shop1 = new Shop(18, 28, 6, 8);
        shop1.createRoom(this);

        const shop2 = new Shop(16, 40, 7, 7);
        shop2.createRoom(this);

        const shop3 = new Shop(35, 48, 10, 6);
        shop3.createRoom(this);

        const shop4 = new Shop(40, 41, 5, 7);
        shop4.createRoom(this);

        const shop5 = new Forge(37, 26, 10, 10);
        shop5.createRoom(this);

        let jStart = 10;
        let jEnd = 15;
        for (let i = 5; i < this.width - 5; i++) {
            const jStartRandom = Math.random();
            if (jStartRandom > .95) {
                jStart -= 1;
            } else if (jStartRandom > .9) {
                jStart += 1;
            }


            const jEndRandom = Math.random();
            if (jEndRandom > .95) {
                jEnd -= 1;
            } else if (jEndRandom > .9) {
                jEnd += 1;
            }

            if (jEnd < jStart + 2) {
                jEnd = jStart + 2;
            }

            if (jEnd > jStart + 6) {
                jEnd = jStart + 6;
            }

            for (let j = jStart; j <= jEnd; j++) {
                this.tiles.get(-1)[i][j] = entityLoader.createFromTemplate('floor', {components: {positionalobject: {x: i, y: j, z: -1}}});
                this.tiles.get(0)[i][j] = entityLoader.createFromTemplate('water', {components: {positionalobject: {x: i, y: j, z: 0}}});
            }
        }

        // Fill rest of floors
        for (let j = 5; j < this.height - 5; j++) {
            for (let i = 5; i < this.width - 5; i++) {
                if (i === 44 && j >= 33 && j <= 35) {
                    this.tiles.get(MapLayer.Wall)[i][j] = entityLoader.createFromTemplate('table', {components: {positionalobject: {x: i, y: j, z: 1}}});
                }

                if ((i === 37 && j === 36) || ((i === 42 && j === 31))) {
                    this.tiles.get(1)[i][j] = entityLoader.createFromTemplate('post', {components: {positionalobject: {x: i, y: j, z: 1}}});
                    this.tiles.get(2)[i][j] = entityLoader.createFromTemplate('post', {components: {positionalobject: {x: i, y: j, z: 2}}});
                }

                const floorTile = this.tiles.get(MapLayer.Floor)[i][j];
                if (!floorTile) {
                    this.tiles.get(-1)[i][j] = entityLoader.createFromTemplate('floor', {components: {positionalobject: {x: i, y: j, z: -1}}});

                    if (i === 31 && j === 31) {
                        this.tiles.get(MapLayer.Floor)[i][j] = entityLoader.createFromTemplate("stairs_north", {components: {positionalobject: {x: i, y: j, z: 0}, stairsInteractable: {generator: "basic-dungeon"}}});
                    } else {
                        this.tiles.get(MapLayer.Floor)[i][j] = entityLoader.createFromTemplate('floor_grass', {components: {positionalobject: {x: i, y: j, z: 0}}});
                    }

                    if (i === 29 && j >= 35 && j <= 39) {
                        this.tiles.get(MapLayer.Wall)[i][j] = entityLoader.createFromTemplate('fence_vertical', {components: {positionalobject: {x: i, y: j, z: 1}}});
                    } else if (i === 32 && j === 41) {
                        this.tiles.get(MapLayer.Wall)[i][j] = entityLoader.createFromTemplate('well', {components: {positionalobject: {x: i, y: j, z: 1}}});
                    } else if ((i === 36 || i === 37) && j === 47) {
                        this.tiles.get(MapLayer.Wall)[i][j] = entityLoader.createFromTemplate('barrel', {components: {positionalobject: {x: i, y: j, z: 1}}});
                    } else if (i === 19 && j === 17) {
                        this.tiles.get(MapLayer.Wall)[i][j] = entityLoader.createFromTemplate('bench_south', {components: {positionalobject: {x: i, y: j, z: 1}}});
                    } else if (i === 20 && j === 17) {
                        this.tiles.get(MapLayer.Wall)[i][j] = entityLoader.createFromTemplate('bench_south_left', {components: {positionalobject: {x: i, y: j, z: 1}}});
                    } else if (i === 18 && j === 17) {
                        this.tiles.get(MapLayer.Wall)[i][j] = entityLoader.createFromTemplate('bench_south_right', {components: {positionalobject: {x: i, y: j, z: 1}}});
                    } else if (i > 17 && i < 21 && j === 20) {
                        this.tiles.get(MapLayer.Wall)[i][j] = entityLoader.createFromTemplate('bench_stone', {components: {positionalobject: {x: i, y: j, z: 1}}});
                    } else {
                        const floor = this.tiles.get(MapLayer.Floor)[i][j];
                        if (floor.components.walkable && floor.components.walkable.walkable) {
                            if (Math.random() < .01) {
                                this.createTree(i, j);
                            } else if (Math.random() < .05) {
                                this.tiles.get(MapLayer.Wall)[i][j] = entityLoader.createFromTemplate('stone', {components: {positionalobject: {x: i, y: j, z: 1}}});
                            } else {
                                if (Math.random() < .3) {
                                    const randomGrass = MathUtils.randInt(1, 4);
                                    this.tiles.get(MapLayer.Wall)[i][j] = entityLoader.createFromTemplate('grass' + randomGrass, {components: {positionalobject: {x: i, y: j, z: 1}}});
                                }
                            }
                        }
                    }
                }
            }
        }

        this.addPlayer(33, 36);
    }

    createTree(x, y) {
        for (let z = 1; z <= 8; z++) {
            this.tiles.get(z)[x][y] = entityLoader.createFromTemplate('tree_trunk', {components: {positionalobject: {x: x, y: y, z: z}}});
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
                            this.tiles.get(z)[x+i][y+j] = entityLoader.createFromTemplate('tree_leaves', {components: {positionalobject: {x: x+i, y: y+j, z: z}}});
                        }
                    }
                }
            }
        }

        this.tiles.get(9)[x][y] = entityLoader.createFromTemplate('tree_leaves', {components: {positionalobject: {x: x, y: y, z: 9}}});
    }
}