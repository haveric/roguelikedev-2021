import BaseFov from "./_BaseFov";
import FovSlope from "./FovSlope";
import engine from "../../Engine";

/**
 * Credit to Adam Milazzo for this fov algorithm: http://www.adammil.net/blog/v125_roguelike_vision_algorithms.html
 */
export default class AdamMilazzoFov extends BaseFov {
    constructor() {
        super();
    }

    compute(x, y, z, radius, minZ, maxZ) {
        super.compute(x, y, z, radius);

        this.exploreTile(x, y, minZ, maxZ);
        for (let octant = 0; octant < 8; octant ++) {
            this.computeOctant(octant, x, y, z, radius, 1, new FovSlope(1, 1), new FovSlope(0, 1), minZ, maxZ);
        }
    }

    computeOctant(octant, originX, originY, originZ, rangeLimit, x, top, bottom, minZ, maxZ) {
        for (; x <= rangeLimit; x++) {
            let topY;
            if (top.x === 1) {
                topY = x;
            } else {
                topY = Math.round(((x * 2 - 1) * top.y + top.x) / (top.x * 2));

                if (this.blocksLight(octant, originX, originY, originZ, x, topY, minZ, maxZ)) {
                    if (top.greaterOrEqual(topY * 2 + 1, x * 2) && !this.blocksLight(octant, originX, originY, originZ, x, topY + 1, minZ, maxZ)) {
                        topY ++;
                    }
                } else {
                    let ax = x * 2;
                    if (this.blocksLight(octant, originX, originY, originZ, x + 1, topY + 1, minZ, maxZ)) {
                        ax ++;
                    }

                    if (top.greater(topY * 2 + 1, ax)) {
                        topY ++;
                    }
                }
            }

            let bottomY;
            if (bottom.y === 0) {
                bottomY = 0;
            } else {
                bottomY = ((x * 2 - 1) * bottom.y + bottom.x) / (bottom.x * 2);

                if (bottom.greaterOrEqual(bottomY * 2 + 1, x * 2) && this.blocksLight(octant, originX, originY, originZ, x, bottomY, minZ, maxZ) && !this.blocksLight(octant, originX, originY, originZ, x, bottomY + 1, minZ, maxZ)) {
                    bottomY ++;
                }
            }

            let wasOpaque = -1; // 0:false, 1:true, -1:not applicable
            for (let y = topY; y >= bottomY; y--) {
                const isOpaque = this.blocksLight(octant, originX, originY, originZ, x, y, minZ, maxZ);
                const isVisible = isOpaque || ((y !== topY || top.greaterOrEqual(y, x)) && (y !== bottomY || bottom.lessOrEqual(y, x)));

                if (isVisible) {
                    this.setVisible(octant, originX, originY, x, y, minZ, maxZ);
                }

                if (x !== rangeLimit) {
                    if (isOpaque) {
                        if (wasOpaque === 0) {
                            const nx = x * 2;
                            const ny = y * 2 + 1;

                            if (top.greater(ny, nx)) {
                                if (y === bottomY) {
                                    bottom = new FovSlope(ny, nx);
                                    break;
                                } else {
                                    this.computeOctant(octant, originX, originY, originZ, rangeLimit, x + 1, top, new FovSlope(ny, nx), minZ, maxZ);
                                }
                            } else {
                                if (y === bottomY) {
                                    return;
                                }
                            }
                        }

                        wasOpaque = 1;
                    } else {
                        if (wasOpaque > 0) {
                            const nx = x * 2;
                            const ny = y * 2 + 1;

                            if (bottom.greaterOrEqual(ny, nx)) {
                                return;
                            }

                            top = new FovSlope(ny, nx);
                        }

                        wasOpaque = 0;
                    }
                }
            }

            if (wasOpaque !== 0) {
                break;
            }
        }
    }

    blocksLight(octant, originX, originY, originZ, x, y, minZ, maxZ) {
        switch(octant) {
            case 0:
                originX += x;
                originY -= y;
                break;
            case 1:
                originX += y;
                originY -= x;
                break;
            case 2:
                originX -= y;
                originY -= x;
                break;
            case 3:
                originX -= x;
                originY -= y;
                break;
            case 4:
                originX -= x;
                originY += y;
                break;
            case 5:
                originX -= y;
                originY += x;
                break;
            case 6:
                originX += y;
                originY += x;
                break;
            case 7:
                originX += x;
                originY += y;
                break;
        }

        let blocksLight = false;
        if (engine.gameMap.tiles.has(originZ)) {
            const wallTiles = engine.gameMap.tiles.get(originZ);
            if (wallTiles[originX]) {
                const wallTile = wallTiles[originX][originY];
                if (wallTile) {
                    const blocksFov = wallTile.getComponent("blocksFov");
                    if (blocksFov) {
                        blocksLight = blocksFov.blocksFov;
                    }
                }
            }
        }

        return blocksLight;
    }

    setVisible(octant, originX, originY, x, y, minZ, maxZ) {
        switch(octant) {
            case 0:
                originX += x;
                originY -= y;
                break;
            case 1:
                originX += y;
                originY -= x;
                break;
            case 2:
                originX -= y;
                originY -= x;
                break;
            case 3:
                originX -= x;
                originY -= y;
                break;
            case 4:
                originX -= x;
                originY += y;
                break;
            case 5:
                originX -= y;
                originY += x;
                break;
            case 6:
                originX += y;
                originY += x;
                break;
            case 7:
                originX += x;
                originY += y;
                break;
        }

        this.exploreTile(originX, originY, minZ, maxZ);
    }
}