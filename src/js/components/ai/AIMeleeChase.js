import AI from "./_AI";
import Extend from "../../util/Extend";
import AdamMilazzoFov from "../../map/fov/AdamMilazzoFov";
import {MathUtils, Vector3} from "three";
import WanderAction from "../../actions/WanderAction";
import MeleeAction from "../../actions/actionWithDirection/MeleeAction";
import AStar from "../../pathfinding/AStar";
import Graph from "../../pathfinding/Graph";
import engine from "../../Engine";
import WaitAction from "../../actions/WaitAction";
import BumpAction from "../../actions/actionWithDirection/BumpAction";

export default class AIMeleeChase extends AI {
    constructor(args = {}) {
        super(Extend.extend(args, {type: "aiMeleeChase"}));

        this.fov = new AdamMilazzoFov();
        this.chaseLocation = null;
    }

    save() {
        if (this.cachedSave) {
            return this.cachedSave;
        }

        const saveJson = {
            "aiMeleeChase": {}
        };

        this.cachedSave = saveJson;
        return saveJson;
    }

    perform() {
        const entity = this.parentEntity;
        const entityPosition = entity.getComponent("positionalobject");
        if (entityPosition) {
            this.fov.compute(entityPosition.x, entityPosition.y, entityPosition.z, 5, entityPosition.z - 10, entityPosition.z + 10);

            let closestEnemies = [];
            let closestDistance = null;
            const entityFaction = entity.getComponent("faction");
            if (entityFaction) {
                for (const actor of this.fov.visibleActors) {
                    if (actor.isAlive()) {
                        const actorFaction = actor.getComponent("faction");
                        if (entityFaction.isEnemyOf(actorFaction)) {
                            const actorPosition = actor.getComponent("positionalobject");

                            if (actorPosition) {
                                const dx = Math.abs(actorPosition.x - entityPosition.x);
                                const dy = Math.abs(actorPosition.y - entityPosition.y);
                                const distance = Math.max(dx, dy);

                                if (closestDistance === null || distance < closestDistance) {
                                    closestEnemies = [];
                                    closestEnemies.push(actor);
                                    closestDistance = distance;
                                } else if (distance === closestDistance) {
                                    closestEnemies.push(actor);
                                }
                            }
                        }
                    }
                }
            }

            let closestEnemy;
            if (closestEnemies.length === 1) {
                closestEnemy = closestEnemies[0];
            } else if (closestEnemies.length > 1) {
                const index = MathUtils.randInt(0, closestEnemies.length - 1);
                closestEnemy = closestEnemies[index];
            }

            if (closestEnemy) {
                const closestEnemyPosition = closestEnemy.getComponent("positionalobject");
                this.chaseLocation = new Vector3(closestEnemyPosition.x, closestEnemyPosition.y, closestEnemyPosition.z);

                if (closestDistance <= 1) {
                    return new MeleeAction(entity, closestEnemyPosition.x - entityPosition.x, closestEnemyPosition.y - entityPosition.y, closestEnemyPosition.z - entityPosition.z).perform();
                }
            } else {
                if (this.chaseLocation !== null && this.chaseLocation.x === entityPosition.x && this.chaseLocation.y === entityPosition.y && this.chaseLocation.z === entityPosition.z) {
                    this.chaseLocation = null;
                }

                if (this.chaseLocation === null) {
                    return new WanderAction(entity).perform();
                }
            }

            // Move towards enemy
            const gameMap = engine.gameMap;
            const fovWidth = this.fov.right - this.fov.left;
            const fovHeight = this.fov.bottom - this.fov.top;
            const cost = Array(fovWidth).fill().map(() => Array(fovHeight).fill(0));

            for (let i = this.fov.left; i < this.fov.right; i++) {
                for (let j = this.fov.top; j < this.fov.bottom; j++) {
                    const wallTile = gameMap.tiles.get(entityPosition.z)[i][j];
                    if (wallTile) {
                        const blocksMovementComponent = wallTile.getComponent("blocksMovement");
                        if (blocksMovementComponent && blocksMovementComponent.blocksMovement) {
                            continue;
                        }
                    }

                    if (!gameMap.tiles.has(entityPosition.z - 1)) {
                        continue;
                    }

                    const floorTile = gameMap.tiles.get(entityPosition.z - 1)[i][j];

                    if (floorTile) {
                        const walkableComponent = floorTile.getComponent("walkable");
                        if (walkableComponent && walkableComponent.walkable) {
                            cost[i - this.fov.left][j - this.fov.top] += 10;
                        }
                    }
                }
            }

            for (const actor of this.fov.visibleActors) {
                if (actor.isAlive()) {
                    const actorPosition = actor.getComponent("positionalobject");
                    if (actorPosition) {
                        cost[actorPosition.x - this.fov.left][actorPosition.y - this.fov.top] += 100;
                    }
                }
            }

            const costGraph = new Graph(cost, { diagonal: true });

            const start = costGraph.grid[entityPosition.x - this.fov.left][entityPosition.y - this.fov.top];
            const end = costGraph.grid[this.chaseLocation.x - this.fov.left][this.chaseLocation.y - this.fov.top];

            const path = AStar.search(costGraph, start, end);
            if (path && path.length > 0) {
                const next = path.shift();
                return new BumpAction(entity, next.x + this.fov.left - entityPosition.x, next.y + this.fov.top - entityPosition.y, entityPosition.z).perform();
            } else {
                return new WaitAction(entity).perform();
            }
        }
    }
}