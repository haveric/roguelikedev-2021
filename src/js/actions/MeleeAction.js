import ActionWithDirection from "./_ActionWithDirection";
import UnableToPerformAction from "./UnableToPerformAction";
import engine from "../Engine";

export default class MeleeAction extends ActionWithDirection {
    constructor(dx, dy, dz) {
        super(dx, dy, dz);
    }

    perform(entity) {
        const position = entity.getComponent("positionalobject");
        if (!position) {
            return new UnableToPerformAction("Entity doesn't have a position.");
        }

        const destX = position.x + this.dx;
        const destY = position.y + this.dy;
        const destZ = position.z + this.dz;

        const blockingActor = engine.gameMap.getBlockingActorAtLocation(destX, destY, destZ);
        if (blockingActor) {
            const entityFighter = entity.getComponent("fighter");
            const blockingFighter = blockingActor.getComponent("fighter");
            if (entityFighter && blockingFighter) {
                const damage = entityFighter.power - blockingFighter.defense;

                let name;
                let plural;
                if (entity === engine.player) {
                    name = "You";
                    plural = "";
                } else {
                    name = entity.name;
                    plural = "s"
                }

                let blockingName;
                if (blockingActor === engine.player) {
                    blockingName = "You";
                } else {
                    blockingName = blockingActor.name;
                }

                let description = name + " attack" + plural + " " + blockingName;
                if (damage > 0) {
                    blockingFighter.takeDamage(damage);
                    console.log(description + " for " + damage + " hit points.");
                } else {
                    console.log(description + ", but does no damage.");
                }
            }
        } else {
            return new UnableToPerformAction("There's nothing to attack there!");
        }
    }
}