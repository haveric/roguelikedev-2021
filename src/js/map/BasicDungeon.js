import GameMap from "./GameMap";
import RectangularRoom from "./room/RectangularRoom";
import engine from "../Engine";
import Character from "../entity/Character";
import MapGeneration from "./mapGeneration/MapGeneration";
import RandomUtil from "../util/RandomUtil";
import MapLayer from "./MapLayer";
import SolidTile from "../entity/SolidTile";
import CharacterTile from "../entity/CharacterTile";

export default class BasicDungeon extends GameMap {
    constructor(width, height, args = {}) {
        super(width, height);

        this.maxRooms = args.maxRooms || 30;
        this.roomMinSize = args.roomMinSize || 6;
        this.roomMaxSize = args.roomMaxSize || 10;

    }

    create() {
        super.create();

        // Pre-fill with floor and walls
        for (let j = 0; j < this.height; j++) {
            for (let i = 0; i < this.width; i++) {
                this.tiles.get(MapLayer.Floor)[i][j] = new SolidTile({name: "Floor", x: i, y: j, z: 0, scale: 1, color: 0x333333});
                this.tiles.get(MapLayer.Wall)[i][j] = new CharacterTile({name: "Wall", x: i, y: j, z: 1, scale: 1, letter: "#", color: 0x666666});
            }
        }

        const rooms = [];
        for (let i = 0; i < this.maxRooms; i++) {
            const roomWidth = RandomUtil.getRandomBetween(this.roomMinSize, this.roomMaxSize);
            const roomHeight = RandomUtil.getRandomBetween(this.roomMinSize, this.roomMaxSize);

            const x = RandomUtil.getRandomBetween(0, this.width - roomWidth - 1);
            const y = RandomUtil.getRandomBetween(0, this.height - roomHeight - 1);

            const newRoom = new RectangularRoom(x, y, roomWidth, roomHeight);
            let intersectsOtherRoom = false;
            for (const room of rooms) {
                if (newRoom.intersects(room)) {
                    intersectsOtherRoom = true;
                    break;
                }
            }

            if (intersectsOtherRoom) {
                continue;
            }

            newRoom.createRoom(this);

            if (rooms.length === 0) {
                engine.player = new Character({name: "Player", x: newRoom.getCenterX(), y: newRoom.getCenterY(), z: 1, letter: '@', color: 0xffffff});
                engine.gameMap.actors.push(engine.player);
                const positionalObject = engine.player.getComponent("positionalobject");
                positionalObject.setVisible();
            } else {
                const lastRoom = rooms[rooms.length - 1];
                MapGeneration.tunnelBetween(this, lastRoom.getCenterX(), lastRoom.getCenterY(), newRoom.getCenterX(), newRoom.getCenterY());
            }

            rooms.push(newRoom);
        }
    }
}