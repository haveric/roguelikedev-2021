import engine from "../Engine";
import controls from "../controls/Controls";
import MovementAction from "../actions/MovementAction";

export default class EventHandler {
    constructor() {

    }

    handleInput() {
        let action = null;
        if (controls.testPressed("up")) {
            action = new MovementAction(0, 1);
        } else if (controls.testPressed("down")) {
            action = new MovementAction(0, -1);
        } else if (controls.testPressed("left")) {
            action = new MovementAction(-1);
        } else if (controls.testPressed("right")) {
            action = new MovementAction(1);
        } else if (controls.testPressed("nw")) {
            action = new MovementAction(-1, 1);
        } else if (controls.testPressed("ne")) {
            action = new MovementAction(1, 1);
        } else if (controls.testPressed("sw")) {
            action = new MovementAction(-1, -1);
        } else if (controls.testPressed("se")) {
            action = new MovementAction(1, -1);
        } else if (controls.testPressed("wait")) {
            action = new MovementAction(0, 0);
        } else if (controls.testPressed("save", 1000)) {
            engine.gameMap.save("save1");
        } else if (controls.testPressed("load", 1000)) {
            engine.gameMap.load("save1");
        } else if (controls.testPressed("debug")) {
            engine.gameMap.reveal();
            engine.needsMapUpdate = true;
        }

        return action;
    }
}