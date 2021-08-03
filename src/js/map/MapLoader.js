import BasicDungeon from "./BasicDungeon";

export default class MapLoader {
    constructor() {}

    loadMap(mapType) {
        switch(mapType) {
            case "basic-dungeon":
                return new BasicDungeon(100, 100);
            default:
                return null;
        }
    }
}