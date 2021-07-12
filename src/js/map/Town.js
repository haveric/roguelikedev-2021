import GameMap from "./GameMap";
import engine from "../Engine";
import entityLoader from "../entity/EntityLoader";
import sceneState from "../SceneState";
import MapLayer from "./MapLayer";
import Shop from "./room/Shop";

export default class Town extends GameMap {
    constructor() {
        super(30, 30);
    }

    create() {
        super.create();

        const newRoom = new Shop(3, 3, 6, 8);
        newRoom.createRoom(this);

        // Fill rest of floors
        for (let j = 0; j < this.height; j++) {
            for (let i = 0; i < this.width; i++) {
                const floorTile = this.tiles.get(MapLayer.Floor)[i][j];
                if (!floorTile) {
                    this.tiles.get(MapLayer.Floor)[i][j] = entityLoader.createFromTemplate('Grass', {components: {positionalobject: {x: i, y: j, z: 0}}});
                }
            }
        }

        engine.player = entityLoader.createFromTemplate('Player', {components: {positionalobject: {x: 5, y: 5, z: 1}}});
        engine.gameMap.actors.push(engine.player);
        const positionalObject = engine.player.getComponent("positionalobject");
        positionalObject.setVisible();
        sceneState.updateCameraPosition(engine.player);
    }
}