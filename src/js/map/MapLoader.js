import BasicDungeon from "./BasicDungeon";

export default class MapLoader {
    constructor() {}

    loadMap(mapType, args = {}) {
        switch(mapType) {
            case "basic-dungeon":
                return new BasicDungeon(100, 100, args);
            default:
                return null;
        }
    }
}