// Keyboard
const Key = {
    LEFT: "ArrowLeft",
    RIGHT: "ArrowRight",
    UP: "ArrowUp",
    DOWN: "ArrowDown",
    BACKSPACE: "Backspace",
    TAB: "Tab",
    ENTER: "Enter",
    SHIFT_LEFT: "Left Shift",
    SHIFT_RIGHT: "Right Shift",
    CONTROL_LEFT: "Left Control",
    CONTROL_RIGHT: "Right Control",
    ALT_LEFT: "Left Alt",
    ALT_RIGHT: "Right Alt",
    PAUSE_BREAK: "Pause",
    CAPS_LOCK: "CapsLock",
    ESCAPE: "Escape",
    SPACE: " ",
    PAGE_UP: "PageUp",
    PAGE_DOWN: "PageDown",
    END: "End",
    HOME: "Home",
    INSERT: "Insert",
    DELETE: "Delete",
    OS_LEFT: "Left OS",
    OS_RIGHT: "Right OS",
    CONTEXT_MENU: "ContextMenu",
    SCROLL_LOCK: "ScrollLock",
    NUM_LOCK: "NumLock",
    NUMPAD_DIVIDE: "Numpad /",
    NUMPAD_MULTIPLY: "Numpad *",
    NUMPAD_SUBTRACT: "Numpad -",
    NUMPAD_ADD: "Numpad +",
    NUMPAD_ENTER: "Numpad Enter",
    NUMPAD_PERIOD: "Numpad .",
    NUMPAD_0: "Numpad 0",
    NUMPAD_1: "Numpad 1",
    NUMPAD_2: "Numpad 2",
    NUMPAD_3: "Numpad 3",
    NUMPAD_4: "Numpad 4",
    NUMPAD_5: "Numpad 5",
    NUMPAD_6: "Numpad 6",
    NUMPAD_7: "Numpad 7",
    NUMPAD_8: "Numpad 8",
    NUMPAD_9: "Numpad 9",
}

// Controllers (Tested with XBOX 360)
const Btn = {
    A: "gamepad0",
    B: "gamepad1",
    X: "gamepad2",
    Y: "gamepad3",
    LB: "gamepad4",
    RB: "gamepad5",
    LT: "gamepad6",
    RT: "gamepad7",
    BACK: "gamepad8",
    START: "gamepad9",
    LEFT_STICK_CLICK: "gamepad10",
    RIGHT_STICK_CLICK: "gamepad11",
    UP: "gamepad12",
    DOWN: "gamepad13",
    LEFT: "gamepad14",
    RIGHT: "gamepad15",
    LEFT_STICK_LEFT: "axis0-left",
    LEFT_STICK_RIGHT: "axis0-right",
    LEFT_STICK_UP: "axis1-left",
    LEFT_STICK_DOWN: "axis1-right",
    RIGHT_STICK_LEFT: "axis2-left",
    RIGHT_STICK_RIGHT: "axis2-right",
    RIGHT_STICK_UP: "axis3-left",
    RIGHT_STICK_DOWN: "axis3-right"
}


class Controls {
    constructor() {
        const self = this;

        self.defaultDelay = 25;
        self.keysDown = [];
        self.keysDelayed = [];
        self.defaults = new Map();

        self.controls = new Map();
        self.defaults.set("left", [Key.LEFT, "a", Key.NUMPAD_4, Btn.LEFT, Btn.LEFT_STICK_LEFT]);
        self.defaults.set("right", [Key.RIGHT, "d", Key.NUMPAD_6, Btn.RIGHT, Btn.LEFT_STICK_RIGHT]);
        self.defaults.set("up", [Key.UP, "w", Key.NUMPAD_8, Btn.UP, Btn.LEFT_STICK_UP]);
        self.defaults.set("down", [Key.DOWN, "s", Key.NUMPAD_2, Btn.DOWN, Btn.LEFT_STICK_DOWN]);

        self.defaults.set("editor-left", [Key.LEFT, Btn.LEFT, Btn.LEFT_STICK_LEFT]);
        self.defaults.set("editor-right", [Key.RIGHT, Btn.RIGHT, Btn.LEFT_STICK_RIGHT]);
        self.defaults.set("editor-up", [Key.UP, Btn.UP, Btn.LEFT_STICK_UP]);
        self.defaults.set("editor-down", [Key.DOWN, Btn.DOWN, Btn.LEFT_STICK_DOWN]);

        self.defaults.set("nw", [Key.NUMPAD_7]);
        self.defaults.set("ne", [Key.NUMPAD_9]);
        self.defaults.set("sw", [Key.NUMPAD_1]);
        self.defaults.set("se", [Key.NUMPAD_3]);

        self.defaults.set("wait", [Key.NUMPAD_5]);
        self.defaults.set("action", [Key.SPACE, Key.ENTER, Btn.A]);

        self.defaults.set("save", ["F8"]);
        self.defaults.set("load", ["F9"]);
        self.defaults.set("debug", ["F2"]);
        self.defaults.set("debug2", ["F4"]);

        self.defaults.set("reset", ["r", Btn.START]);

        self.resetToDefault();

        addEventListener("keydown", function (e) {
            //console.log("Keydown: " + e.keyCode + ", Location: " + e.location);
            let key = self.getKey(e.key, e.code);
            self.keysDown[key] = true;
        }, false);


        addEventListener("keyup", function (e) {
            //console.log("Keyup: " + e.keyCode + ", Location: " + e.location);
            let key = self.getKey(e.key, e.code);

            delete self.keysDown[key];
            delete self.keysDelayed[key];
        }, false);
    }

    getKey(key, code) {
        if (!code.startsWith("Arrow")) {
            if (code.endsWith("Left")) {
                key = "Left " + key;
            } else if (code.endsWith("Right")) {
                key = "Right " + key;
            } else if (code.startsWith("Numpad")) {
                key = "Numpad " + key;
            }
        }

        return key;
    }

    resetToDefault() {
        const self = this;

        self.defaults.forEach(function(value, key) {
            self.controls.set(key, value);
        });
    }

    setCustomKeys(name, keys) {
        this.controls.set(name, keys);
    }

    isPressed(key) {
        const self = this;
        let pressed = false;

        self.controls.get(key).forEach(function(keyToTest) {
            if (keyToTest in self.keysDown) {
                pressed = true;
            }
        });

        return pressed;
    }

    isDelayed(key) {
        const self = this;
        let delayed = false;

        this.controls.get(key).forEach(function(keyToTest) {
            if (keyToTest in self.keysDelayed) {
                delayed = true;
            }
        });

        return delayed;
    }

    deleteKey(key, delay) {
        const self = this;
        self.controls.get(key).forEach(function(keyToTest) {
            delete self.keysDown[keyToTest];
            if (delay) {
                self.keysDelayed[keyToTest] = true;
            }
        });

        if (delay) {
            setTimeout(function() {
                self.controls.get(key).forEach(function(keyToTest) {
                    delete self.keysDelayed[keyToTest];
                });
            }, delay);
        }
    }

    /**
     *  Returns true if press succeeds
     *          false if press does not succeed
     */
    testPressed(key, delay) {
        delay = delay || this.defaultDelay;

        const self = this;
        let succeeded = false;

        if (self.isPressed(key) && !self.isDelayed(key)) {
            self.deleteKey(key, delay);
            succeeded = true;
        }

        return succeeded;
    }

    hasControllerSupport() {
        return "getGamepads" in navigator;
    }

    checkForGamepads() {
        const self = this;
        if (this.hasControllerSupport()) {
            const numGamepads = navigator.getGamepads().length;
            for (let i = 0; i < numGamepads; i++) {
                const gamepad = navigator.getGamepads()[i];
                if (gamepad) {
                    gamepad.axes.forEach(function(axis, axisIndex) {
                        if (axis <= -0.5) {
                            //console.log("axis" + axisIndex + "-left");
                            self.keysDown["axis" + axisIndex + "-left"] = true;
                        } else if (axis >= 0.5) {
                            //console.log("axis" + axisIndex + "-right");
                            self.keysDown["axis" + axisIndex + "-right"] = true;
                        } else {
                            delete self.keysDown["axis" + axisIndex + "-left"];
                            delete self.keysDown["axis" + axisIndex + "-right"];
                            delete self.keysDelayed["axis" + axisIndex + "-left"];
                            delete self.keysDelayed["axis" + axisIndex + "-right"];
                        }
                    });

                    gamepad.buttons.forEach(function(button, buttonIndex) {
                        if (button.pressed) {
                            //console.log("gamepad" + buttonIndex);
                            self.keysDown["gamepad"+ buttonIndex] = true;
                        } else {
                            delete self.keysDown["gamepad" + buttonIndex];
                            delete self.keysDelayed["gamepad" + buttonIndex];
                        }
                    });
                }
            }
        }
    }
}

const controls = new Controls();
export default controls;


window.addEventListener("gamepadconnected", function(e) {
    const gamepad = navigator.getGamepads()[e.gamepad.index];
    console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.", gamepad.index, gamepad.id, gamepad.buttons.length, gamepad.axes.length);
    console.log(gamepad.buttons);
});

window.addEventListener("gamepaddisconnected", function(e) {
    /*
    var gamepad = navigator.getGamepads()[e.gamepad.index];
    console.log("Gamepad disconnected at index %d: %s. %d buttons, %d axes.", gamepad.index, gamepad.id, gamepad.buttons.length, gamepad.axes.length);
    */
});