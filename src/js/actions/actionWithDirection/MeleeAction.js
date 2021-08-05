import ActionWithDirection from "./_ActionWithDirection";
import UnableToPerformAction from "../UnableToPerformAction";
import engine from "../../Engine";
import messageConsole from "../../ui/MessageConsole";

export default class MeleeAction extends ActionWithDirection {
    constructor(entity, dx, dy, dz) {
        super(entity, dx, dy, dz);
    }

    perform() {
        const position = this.entity.getComponent("positionalobject");
        if (!position) {
            return new UnableToPerformAction(this.entity, "Entity doesn't have a position.");
        }

        const destX = position.x + this.dx;
        const destY = position.y + this.dy;
        const destZ = position.z + this.dz;

        const blockingActor = engine.gameMap.getBlockingActorAtLocation(destX, destY, destZ);
        if (blockingActor) {
            const entityFighter = this.entity.getComponent("fighter");
            const blockingFighter = blockingActor.getComponent("fighter");
            if (entityFighter && blockingFighter) {
                const damage = entityFighter.getDamage() - blockingFighter.getBlockedDamage();

                let name;
                let plural;
                if (this.isPlayer()) {
                    name = "You";
                    plural = "";
                } else {
                    name = this.entity.name;
                    plural = "s"
                }

                let blockingName;
                let attackColor;
                if (blockingActor === engine.player) {
                    blockingName = "You";
                    attackColor = "#C00";
                } else {
                    blockingName = blockingActor.name;
                    attackColor = "#999";
                }

                let description = name + " attack" + plural + " " + blockingName;
                if (damage > 0) {
                    messageConsole.text(description + " for " + damage + " hit points.", attackColor).build();
                    blockingFighter.takeDamage(damage);
                } else {
                    messageConsole.text(description + ", but does no damage.", attackColor).build();
                }

                this.entity.callEvent("onMeleeAttack", blockingActor);
            }
        } else {
            return new UnableToPerformAction(this.entity, "There's nothing to attack there!");
        }
    }
}