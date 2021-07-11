import BaseFov from "./_BaseFov";

export default class SimpleFov extends BaseFov {
    constructor() {
        super();
    }

    compute(gameMap, x, y, radius) {
        super.compute(gameMap, x, y, radius);

        const minX = Math.max(0, x - radius);
        const maxX = Math.min(gameMap.width, x + radius);
        const minY = Math.max(0, y - radius);
        const maxY = Math.min(gameMap.height, y + radius);

        for (let i = minX; i < maxX; i++) {
            for (let j = minY; j < maxY; j++) {
                this.exploreTile(gameMap, i, j);
            }
        }

        this.postCompute();
    }
}