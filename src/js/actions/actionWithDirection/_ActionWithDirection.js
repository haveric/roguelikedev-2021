import Action from "../_Action";

export default class ActionWithDirection extends Action {
    constructor(entity, dx = 0, dy = 0, dz = 0) {
        super(entity);

        this.dx = dx;
        this.dy = dy;
        this.dz = dz;
    }

    perform() {
        console.error("Not Implemented");
    }
}