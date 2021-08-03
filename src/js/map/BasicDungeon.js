import GameMap from "./GameMap";
import RectangularRoom from "./room/RectangularRoom";
import MapGeneration from "./mapGeneration/MapGeneration";
import MapLayer from "./MapLayer";
import entityLoader from "../entity/EntityLoader";
import {MathUtils} from "three";
import engine from "../Engine";

export default class BasicDungeon extends GameMap {
    constructor(width, height, args = {}) {
        const name = "basic-dungeon-" + MathUtils.randInt(100000000, 999999999);
        super(name, width, height);

        this.maxRooms = args.maxRooms || 30;
        this.roomMinSize = args.roomMinSize || 6;
        this.roomMaxSize = args.roomMaxSize || 10;
        this.maxMonstersPerRoom = args.maxMonstersPerRoom || 2;
        this.maxItemsPerRoom = args.maxItemsPerRoom || 2;
    }

    create(previousMapName, stairsInteractable) {
        super.create();

        // Pre-fill with floor and walls
        for (let j = 0; j < this.height; j++) {
            for (let i = 0; i < this.width; i++) {
                this.tiles.get(-1)[i][j] = entityLoader.createFromTemplate('floor', {components: {positionalobject: {x: i, y: j, z: -1}}});
                this.tiles.get(0)[i][j] = entityLoader.createFromTemplate('floor', {components: {positionalobject: {x: i, y: j, z: 0}}});
                this.tiles.get(1)[i][j] = entityLoader.createFromTemplate('wall', {components: {positionalobject: {x: i, y: j, z: 1}}});
            }
        }

        const rooms = [];
        for (let i = 0; i < this.maxRooms; i++) {
            const roomWidth = MathUtils.randInt(this.roomMinSize, this.roomMaxSize);
            const roomHeight = MathUtils.randInt(this.roomMinSize, this.roomMaxSize);

            const x = MathUtils.randInt(0, this.width - roomWidth - 1);
            const y = MathUtils.randInt(0, this.height - roomHeight - 1);

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
                const centerX = newRoom.getCenterX();
                const centerY = newRoom.getCenterY();

                if (stairsInteractable) {
                    stairsInteractable.x = centerX;
                    stairsInteractable.y = centerY;
                    stairsInteractable.z = 1;
                }

                const playerPosition = engine.player.getComponent("positionalobject");
                if (playerPosition) {
                    this.tiles.get(1)[centerX][centerY] = entityLoader.createFromTemplate('stairs_north', {components: {positionalobject: {x: centerX, y: centerY, z: 1}, stairsInteractable: {map: previousMapName, x: playerPosition.x, y: playerPosition.y, z: playerPosition.z}}});
                }
                this.addPlayer(centerX, centerY);
            } else {
                const lastRoom = rooms[rooms.length - 1];
                MapGeneration.tunnelBetween(this, lastRoom.getCenterX(), lastRoom.getCenterY(), newRoom.getCenterX(), newRoom.getCenterY());
            }

            newRoom.placeEntities(this.maxMonstersPerRoom);
            newRoom.placeItems(this.maxItemsPerRoom);

            rooms.push(newRoom);
        }

        const lastRoom = rooms[rooms.length - 1];
        const lastRoomCenterX = lastRoom.getCenterX();
        const lastRoomCenterY = lastRoom.getCenterY();
        this.tiles.get(0)[lastRoomCenterX][lastRoomCenterY] = entityLoader.createFromTemplate('stairs_north', {components: {positionalobject: {x: lastRoomCenterX, y: lastRoomCenterY, z: 0}, stairsInteractable: {generator: "basic-dungeon"}}});
    }
}