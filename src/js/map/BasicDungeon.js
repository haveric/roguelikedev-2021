import GameMap from "./GameMap";
import RectangularRoom from "./room/RectangularRoom";
import engine from "../Engine";
import MapGeneration from "./mapGeneration/MapGeneration";
import MapLayer from "./MapLayer";
import sceneState from "../SceneState";
import entityLoader from "../entity/EntityLoader";
import {MathUtils} from "three";

export default class BasicDungeon extends GameMap {
    constructor(width, height, args = {}) {
        super(width, height);

        this.maxRooms = args.maxRooms || 30;
        this.roomMinSize = args.roomMinSize || 6;
        this.roomMaxSize = args.roomMaxSize || 10;
        this.maxMonstersPerRoom = args.maxMonstersPerRoom || 2;
    }

    create() {
        super.create();

        // Pre-fill with floor and walls
        for (let j = 0; j < this.height; j++) {
            for (let i = 0; i < this.width; i++) {
                this.tiles.get(MapLayer.Floor)[i][j] = entityLoader.createFromTemplate('Floor', {components: {positionalobject: {x: i, y: j, z: 0}}});
                this.tiles.get(MapLayer.Wall)[i][j] = entityLoader.createFromTemplate('Wall', {components: {positionalobject: {x: i, y: j, z: 1}}});
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
                const position = {
                    components: {
                        positionalobject: {
                            x: newRoom.getCenterX(),
                            y: newRoom.getCenterY(),
                            z: 1}
                    }
                };

                engine.player = entityLoader.createFromTemplate('Player', position);
                engine.gameMap.actors.push(engine.player);
                const positionalObject = engine.player.getComponent("positionalobject");
                positionalObject.setVisible();
                sceneState.updateCameraPosition(engine.player);
            } else {
                const lastRoom = rooms[rooms.length - 1];
                MapGeneration.tunnelBetween(this, lastRoom.getCenterX(), lastRoom.getCenterY(), newRoom.getCenterX(), newRoom.getCenterY());
            }

            newRoom.placeEntities(this.maxMonstersPerRoom);

            rooms.push(newRoom);
        }
    }
}