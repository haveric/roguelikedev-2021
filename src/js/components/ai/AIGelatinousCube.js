import Extend from "../../util/Extend";

import engine from "../../Engine";
import AdamMilazzoFov from "../../map/fov/AdamMilazzoFov";
import {MathUtils, Vector3} from "three";
import MeleeAction from "../../actions/actionWithDirection/MeleeAction";
import WanderAction from "../../actions/WanderAction";
import Graph from "../../pathfinding/Graph";
import AStar from "../../pathfinding/AStar";
import BumpAction from "../../actions/actionWithDirection/BumpAction";
import WaitAction from "../../actions/WaitAction";
import AI from "./_AI";

export default class AIGelatinousCube extends AI {
    constructor(args = {}) {
        super(Extend.extend(args, {type: "aiGelatinousCube"}));

        this.fov = new AdamMilazzoFov();
        this.chaseLocation = null;
    }

    save() {
        return {
            "aiGelatinousCube": {}
        };
    }

    perform() {
        let performAction = null;
        // Normal Melee Chase behaviour
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
                    performAction = new MeleeAction(entity, closestEnemyPosition.x - entityPosition.x, closestEnemyPosition.y - entityPosition.y, closestEnemyPosition.z - entityPosition.z);
                }
            } else {
                if (this.chaseLocation !== null && this.chaseLocation.x === entityPosition.x && this.chaseLocation.y === entityPosition.y && this.chaseLocation.z === entityPosition.z) {
                    this.chaseLocation = null;
                }

                if (this.chaseLocation === null) {
                    performAction = new WanderAction(entity);
                }
            }

            if (!performAction) {
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

                const costGraph = new Graph(cost, {diagonal: true});

                const start = costGraph.grid[entityPosition.x - this.fov.left][entityPosition.y - this.fov.top];
                const end = costGraph.grid[this.chaseLocation.x - this.fov.left][this.chaseLocation.y - this.fov.top];

                const path = AStar.search(costGraph, start, end);
                if (path && path.length > 0) {
                    const next = path.shift();
                    performAction = new BumpAction(entity, next.x + this.fov.left - entityPosition.x, next.y + this.fov.top - entityPosition.y, entityPosition.z);
                } else {
                    performAction = new WaitAction(entity);
                }
            }
        }

        if (performAction) {
            performAction.perform();
        }

        // Pickup all items in spot
        const inventory = entity.getComponent("inventory");
        if (entityPosition) {
            for (const item of this.fov.visibleItems) {
                const itemPosition = item.getComponent("positionalobject");
                if (entityPosition.isSamePosition(itemPosition)) {
                    inventory.add(item);
                    const itemIndex = engine.gameMap.items.indexOf(item);
                    engine.gameMap.items.splice(itemIndex, 1);
                    itemPosition.teardown();
                }
            }
        }
    }
}