import GameMap from "./GameMap";
import MapLayer from "./MapLayer";
import engine from "../Engine";
import entityLoader from "../entity/EntityLoader";
import ArrayUtil from "../util/ArrayUtil";

export default class MainMenuMap extends GameMap {
    constructor() {
        super("main-menu", 35, 15);

        this.floor = [
            "###################################",
            "###################################",
            "###################################",
            "#####≈≈############################",
            "#####≈≈############################",
            "###################################",
            "###################################",
            "###################################",
            "###################################",
            "###################################",
            "###################################",
            "###################################",
            "###################################",
            "###################################",
            "###################################"
        ];

        this.wall = [
            "###################################",
            "###################################",
            "####====###########################",
            "####=  =###########################",
            "####=  =###########################",
            "####=  =###########################",
            "####=  =###########################",
            "##===  =########################===",
            "##=    =#################======#= >",
            "##=    =#########=======#=    =#= =",
            "##=    ===========     ===    === =",
            "##=                    + +        =",
            "##=       ==== ===     ===    =====",
            "##=========##= =#=======#=    =####",
            "#############= =#########======####"
        ];

        this.overlay = [
            "###################################",
            "########## RoguelikeDev ######v5_0#",
            "###################################",
            "############ does the ####2021#6-8#",
            "###################################",
            "### Complete Roguelike Tutorial ###",
            "#####..############################",
            "#####..############################",
            "###....##########################.#",
            "###....###################....###.#",
            "###....###########.....###....###.#",
            "###....................#.#........#",
            "###.......####.###.....###....#####",
            "##############.###########....#####",
            "##############.####################"
        ];
    }

    init() {
        super.init();

        this.tiles.set(MapLayer.Decorative, ArrayUtil.create2dArray(this.width));
    }

    create() {
        super.create();
        const overlayColors = [
            0xff66d9, 0xff66ff, 0xd966ff, 0xb266ff, 0x8c66ff, 0x6666ff, 0x66b2ff, 0x66d9ff, 0x66ffd9, 0x66ffb2, 0x66ff66, 0xb2ff66, 0xd9ff66, 0xffff66, 0xffd966, 0xffb266, 0xff8c66, 0xff668c, 0xff66b2, 0xff66d9, 0xff66ff, 0xd966ff, 0xb266ff, 0x8c66ff, 0x6666ff,
            0x00ffbf, 0x00ff80, 0x00ff00, 0x80ff00, 0xffff00, 0xffbf00, 0xff8000, 0x333333, 0x333333, 0x333333, 0x333333, 0x333333, 0x333333, 0x333333,
            0x00a3d9, 0x00d9d9, 0x00d9a3, 0x00d96c, 0x00d900, 0x6cd900, 0xa3d900, 0xd9d900, 0xd9a300, 0xd96c00, 0xd93600, 0xd90000, 0x333333, 0x333333, 0x333333, 0x333333
        ];
        let overlayColorIndex = 0;
        for (let j = 0; j < this.height; j++) {
            for (let i = 0; i < this.width; i++) {
                const floorChar = this.floor[this.height - j - 1].charAt(i);
                switch(floorChar) {
                    case "#":
                        this.tiles.get(-1)[i][j] = entityLoader.createFromTemplate("floor", {components: {positionalobject: {x: i, y: j, z: -1}}});
                        this.tiles.get(MapLayer.Floor)[i][j] = entityLoader.createFromTemplate("floor", {components: {positionalobject: {x: i, y: j, z: 0}}});
                        break;
                    case "≈":
                        this.tiles.get(-1)[i][j] = entityLoader.createFromTemplate("floor", {components: {positionalobject: {x: i, y: j, z: -1}}});
                        this.tiles.get(MapLayer.Floor)[i][j] = entityLoader.createFromTemplate("water", {components: {positionalobject: {x: i, y: j, z: 0}}});
                        break;
                }

                const wallChar = this.wall[this.height - j - 1].charAt(i);
                switch(wallChar) {
                    case "#":
                    case "=":
                        this.tiles.get(MapLayer.Wall)[i][j] = entityLoader.createFromTemplate("wall", {components: {positionalobject: {x: i, y: j, z: 1}}});
                        break;
                    case "+":
                        this.tiles.get(MapLayer.Wall)[i][j] = entityLoader.createFromTemplate("door", {components: {positionalobject: {x: i, y: j, z: 1}}});
                        break;
                    case ">":
                        this.tiles.get(MapLayer.Wall)[i][j] = entityLoader.createFromTemplate("stairs_north", {components: {positionalobject: {x: i, y: j, z: 1}}});
                        break;
                }

                let overlayChar = this.overlay[this.height - j - 1].charAt(i);
                if (overlayChar !== "#") {
                    if (overlayChar !== ".") {
                        this.tiles.get(MapLayer.DecorativeBG)[i][j] = entityLoader.createFromTemplate("art_backing", {components: {positionalobject: {x: i, y: j, z: 2}}});
                    }

                    if (overlayChar !== " " && overlayChar !== ".") {
                        if (overlayChar === "_") {
                            overlayChar = ".";
                        }

                        this.tiles.get(MapLayer.Decorative)[i][j] = entityLoader.createFromTemplate("art", {components: {characterobject: {x: i, y: j, z: 2.05, letter: overlayChar, color: overlayColors[overlayColorIndex]}}});
                        overlayColorIndex ++;
                    }
                }
            }
        }

        this.addPlayer(21, 3);
        engine.gameMap.actors.push(entityLoader.createFromTemplate("ant", {components: {positionalobject: {x: 27, y: 4, z: 1}}}));
        engine.gameMap.actors.push(entityLoader.createFromTemplate("dragon_red", {components: {positionalobject: {x: 18, y: 4, z: 1}}}));
        engine.gameMap.actors.push(entityLoader.createFromTemplate("goblin", {components: {positionalobject: {x: 5, y: 2, z: 1}}}));

        engine.gameMap.items.push(entityLoader.createFromTemplate("potion_health", {components: {positionalobject: {x: 3, y: 5, z: 1}}}));
        engine.gameMap.items.push(entityLoader.createFromTemplate("^", {components: {positionalobject: {x: 6, y: 5, z: 1}}}));
        engine.gameMap.items.push(entityLoader.createFromTemplate("tower_shield", {components: {positionalobject: {x: 28, y: 1, z: 1}}}));
    }
}