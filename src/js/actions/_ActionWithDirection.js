import Action from "./_Action";

export default class ActionWithDirection extends Action {
    constructor(dx = 0, dy = 0, dz = 0) {
        super();

        this.dx = dx;
        this.dy = dy;
        this.dz = dz;
    }

    perform(entity) {
        console.err("Not Implemented");
    }
}