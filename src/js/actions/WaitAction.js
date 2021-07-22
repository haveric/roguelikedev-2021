import Action from "./_Action";

export default class WaitAction extends Action {
    constructor(entity) {
        super(entity);
    }

    perform() {
        return this;
    }
}