import BaseFov from "./_BaseFov";
import engine from "../../Engine";

export default class SimpleFov extends BaseFov {
    constructor() {
        super();
    }

    compute(x, y, z, radius, minZ, maxZ) {
        super.compute(x, y, z, radius, minZ, maxZ);

        const minX = Math.max(0, x - radius);
        const maxX = Math.min(engine.gameMap.width, x + radius);
        const minY = Math.max(0, y - radius);
        const maxY = Math.min(engine.gameMap.height, y + radius);

        for (let i = minX; i < maxX; i++) {
            for (let j = minY; j < maxY; j++) {
                this.exploreTile(i, j, minZ, maxZ, true);
            }
        }
    }
}