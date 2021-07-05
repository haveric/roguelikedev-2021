import Action from "./_Action";

export default class UnableToPerformAction extends Action {
    constructor(reason) {
        super();

        this.reason = reason;
    }
}