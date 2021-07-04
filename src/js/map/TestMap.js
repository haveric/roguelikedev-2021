import MapLayer from "./MapLayer";
import CharacterTile from "../entity/CharacterTile";
import SolidTile from "../entity/SolidTile";
import GameMap from "./GameMap";
import Character from "../entity/Character";
import gameState from "../GameState";

export default class TestMap extends GameMap {
    constructor(width, height) {
        super(width, height);

        this.create();
    }

    create() {
        super.create();
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
                    tile = new CharacterTile({name: "Water", x: i, y: j, z: 0, scale: .7, letter: "≈", color: 0x3333cc, blocksMovement:false});
                } else {
                    tile = new SolidTile({name: "Floor", x: i, y: j, z: 0, scale: 1, color: 0x333333});
                }

                this.tiles.get(MapLayer.Floor)[i][j] = tile;
            }
        }

        for (let i = 7; i < 13; i++) {
            let goblin = new Character({name: "Goblin", x: i, y: 7, z: 1, letter: 'g', color: 0x33cc33});
            gameState.gameMap.actors.push(goblin);
        }

        gameState.player = new Character({name: "Player", x: 10, y: 10, z: 1, letter: '@', color: 0xffffff});
        gameState.gameMap.actors.push(gameState.player);
        const positionalObject = gameState.player.getComponent("positionalobject");
        positionalObject.setVisible();
    }
}