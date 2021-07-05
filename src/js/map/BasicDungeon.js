import GameMap from "./GameMap";
import MapLayer from "./MapLayer";
import SolidTile from "../entity/SolidTile";
import RectangularRoom from "./room/RectangularRoom";
import CharacterTile from "../entity/CharacterTile";
import engine from "../Engine";
import Character from "../entity/Character";
import MapGeneration from "./mapGeneration/MapGeneration";

export default class BasicDungeon extends GameMap {
    constructor(width, height) {
        super(width, height);
    }

    create() {
        super.create();

        const rooms = [];
        const room1 = new RectangularRoom(20, 15, 10, 15);
        const room2 = new RectangularRoom(35, 15, 10, 15);
        rooms.push(room1);
        rooms.push(room2);

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                for (const room of rooms) {
                    if (i >= room.x1 && i <= room.x2 && j >= room.y1 && j <= room.y2) {
                        const floorTile = this.tiles.get(MapLayer.Floor)[i][j];
                        if (!floorTile) {
                            this.tiles.get(MapLayer.Floor)[i][j] = new SolidTile({name: "Floor", x: i, y: j, z: 0, scale: 1, color: 0x333333});
                        }
                    }

                    const isVerticalEdge = (i === room.x1 || i === room.x2) && j >= room.y1 && j <= room.y2;
                    const isHorizontalEdge = (j === room.y1 || j === room.y2) && i >= room.x1 && i <= room.x2;
                    if (isHorizontalEdge || isVerticalEdge) {
                        const wallTile = this.tiles.get(MapLayer.Wall)[i][j];
                        if (!wallTile) {
                            this.tiles.get(MapLayer.Wall)[i][j] = new CharacterTile({name: "Wall", x: i, y: j, z: 1, scale: 1, letter: "#", color: 0x666666});
                        }
                    }
                }
            }
        }

        MapGeneration.tunnelBetween(this, room1.getCenterX(), room1.getCenterY(), room2.getCenterX(), room2.getCenterY());


        engine.player = new Character({name: "Player", x: 40, y: 20, z: 1, letter: '@', color: 0xffffff});
        engine.gameMap.actors.push(engine.player);
        const positionalObject = engine.player.getComponent("positionalobject");
        positionalObject.setVisible();

    }
}