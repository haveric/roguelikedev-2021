import Action from "./_Action";

export default class NoAction extends Action {
    constructor(entity) {
        super(entity);
    }

    perform() {
        return this;
    }
}