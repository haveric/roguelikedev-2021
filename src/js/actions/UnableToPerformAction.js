import Action from "./_Action";

export default class UnableToPerformAction extends Action {
    constructor(entity, reason) {
        super(entity);

        this.reason = reason;
    }

    perform() {
        return this;
    }
}