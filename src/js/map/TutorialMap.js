import GameMap from "./GameMap";
import MapLayer from "./MapLayer";
import CharacterTile from "../entity/CharacterTile";
import SolidTile from "../entity/SolidTile";
import Character from "../entity/Character";
import Item from "../entity/Item";
import engine from "../Engine";

export default class TutorialMap extends GameMap {
    constructor() {
        super(35, 15);

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
                let floorTile;
                switch(floorChar) {
                    case "#":
                        floorTile = this.tiles.get(MapLayer.Floor)[i][j] = new SolidTile({name: "Floor", x: i, y: j, z: 0, scale: 1, color: 0x666666});
                        break;
                    case "≈":
                        floorTile = this.tiles.get(MapLayer.Floor)[i][j] = new CharacterTile({name: "Water", x: i, y: j, z: 0, scale: .7, letter: "≈", color: 0x3333cc, blocksMovement:false});
                        break;
                }
                if (floorTile) {
                    floorTile.getComponent("positionalobject").setVisible();
                }


                let wallTile;
                const wallChar = this.wall[this.height - j - 1].charAt(i);
                switch(wallChar) {
                    case "#":
                        wallTile = this.tiles.get(MapLayer.Wall)[i][j] = new CharacterTile({name: "Wall", x: i, y: j, z: 1, scale: 1, letter: "#", color: 0x333333});
                        break;
                    case "=":
                        wallTile = this.tiles.get(MapLayer.Wall)[i][j] = new CharacterTile({name: "Wall", x: i, y: j, z: 1, scale: 1, letter: "#", color: 0x4d4d4d});
                        break;
                    case "+":
                        wallTile = this.tiles.get(MapLayer.Wall)[i][j] = new CharacterTile({name: "Door", x: i, y: j, z: 1, scale: 1, letter: "+", color: 0x964b00});
                        break;
                    case ">":
                        wallTile = this.tiles.get(MapLayer.Wall)[i][j] = new CharacterTile({name: "Stairs Up", x: i, y: j, z: 1, scale: .75, letter: ">", color: 0xffffff, blocksMovement: false});
                        break;
                }
                if (wallTile) {
                    wallTile.getComponent("positionalobject").setVisible();
                }

                let overlayTile,
                    overlayBGTile;
                let overlayChar = this.overlay[this.height - j - 1].charAt(i);
                if (overlayChar !== "#") {
                    if (overlayChar !== ".") {
                        overlayBGTile = this.tiles.get(MapLayer.DecorativeBG)[i][j] = new SolidTile({name: "Backing", x: i, y: j, z: 2, scale: .05, color: 0x000001});
                    }

                    if (overlayChar !== " " && overlayChar !== ".") {
                        if (overlayChar === "_") {
                            overlayChar = ".";
                        }
                        overlayTile = this.tiles.get(MapLayer.Decorative)[i][j] = new CharacterTile({name: "Art", x: i, y: j, z: 2.05, scale: .1, letter: overlayChar, color: overlayColors[overlayColorIndex]});
                        overlayColorIndex ++;
                    }
                }

                if (overlayBGTile) {
                    overlayBGTile.getComponent("positionalobject").setVisible();
                }
                if (overlayTile) {
                    overlayTile.getComponent("positionalobject").setVisible();
                }
            }
        }

        engine.player = new Character({name: "Player", x: 21, y: 3, z: 1, letter: '@', color: 0xffffff});
        engine.gameMap.actors.push(engine.player);
        const positionalObject = engine.player.getComponent("positionalobject");
        positionalObject.setVisible();

        engine.gameMap.actors.push(new Character({name: "a", x: 27, y: 4, z: 1, letter: 'a', color: 0xffffff}));
        engine.gameMap.actors.push(new Character({name: "D", x: 18, y: 3, z: 1, letter: 'D', color: 0xffffff}));
        engine.gameMap.actors.push(new Character({name: "g", x: 5, y: 2, z: 1, letter: 'g', color: 0xffffff}));

        engine.gameMap.items.push(new Item({name: "!", x: 3, y: 5, z: 1, letter: '!', color: 0xffffff}));
        engine.gameMap.items.push(new Item({name: "^", x: 6, y: 5, z: 1, letter: '^', color: 0xffffff}));
        engine.gameMap.items.push(new Item({name: "]", x: 28, y: 1, z: 1, letter: ']', color: 0xffffff}));


    }
}