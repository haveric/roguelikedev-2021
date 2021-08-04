import Key from "./Key";

class Controls {
    constructor() {
        const self = this;

        self.defaultDelay = 25;
        self.lastShiftUp = null;
        self.treatShiftNumpadEqual = true;
        self.keysDown = [];
        self.keysDelayed = [];
        self.defaults = new Map();

        self.controls = new Map();
        self.defaults.set("left", [Key.NUMPAD_4, Key.LEFT]);
        self.defaults.set("right", [Key.NUMPAD_6, Key.RIGHT]);
        self.defaults.set("up", [Key.NUMPAD_8, Key.UP]);
        self.defaults.set("down", [Key.NUMPAD_2, Key.DOWN]);

        self.defaults.set("editor-left", [Key.LEFT]);
        self.defaults.set("editor-right", [Key.RIGHT]);
        self.defaults.set("editor-up", [Key.UP]);
        self.defaults.set("editor-down", [Key.DOWN]);

        self.defaults.set("nw", [Key.NUMPAD_7]);
        self.defaults.set("ne", [Key.NUMPAD_9]);
        self.defaults.set("sw", [Key.NUMPAD_1]);
        self.defaults.set("se", [Key.NUMPAD_3]);
        self.defaults.set("wait", [Key.NUMPAD_5]);

        //self.defaults.set("drop", ["d"]);
        self.defaults.set("get", ["g"]);
        self.defaults.set("inventory", ["i"]);
        self.defaults.set("look", ["/"]);
        self.defaults.set("pause", ["p", Key.ESCAPE]);
        self.defaults.set("interact", [Key.ENTER, Key.NUMPAD_ENTER]);

        self.defaults.set("confirm", [Key.ENTER, Key.NUMPAD_ENTER]);
        self.defaults.set("cancel", [Key.ESCAPE, Key.BACKSPACE]);
        self.defaults.set("modifier-speed1", [Key.SHIFT_LEFT, Key.SHIFT_RIGHT]);
        self.defaults.set("modifier-speed2", [Key.CONTROL_LEFT, Key.CONTROL_RIGHT]);
        self.defaults.set("modifier-speed3", [Key.ALT_LEFT, Key.ALT_RIGHT]);

        self.defaults.set("quicksave", ["F8"]);
        self.defaults.set("quickload", ["F9"]);

        self.defaults.set("debug", ["F2"]);
        self.defaults.set("debug2", ["F4"]);
        self.defaults.set("reset", ["r"]);

        self.load();

        addEventListener("keydown", function (e) {
            // TODO: Evaluate if this should be generalized. I don't want to prevent all keys necessarily.
            if (e.key === "/") {
                e.preventDefault();
            }

            if (self.treatShiftNumpadEqual) {
                const numLockOn = e.getModifierState("NumLock");
                // Re-add Shift key from Numpad press
                if (numLockOn && !e.shiftKey && e.code.startsWith("Numpad") && e.keyCode < 90) {
                    if (self.lastShiftUp) {
                        self.keysDown[self.lastShiftUp] = true;
                        //console.log("Bonus Key Down: ", self.lastShiftUp);
                    }
                }
            }

            let key = self.getKey(e.key, e.code);
            //console.log("Key Down: ", key);
            self.keysDown[key] = true;
        }, false);


        addEventListener("keyup", function (e) {
            let key = self.getKey(e.key, e.code);
            if (key === Key.SHIFT_LEFT || key === Key.SHIFT_RIGHT) {
                self.lastShiftUp = key;
            }

            //console.log("Key Up: ", key);
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

        if (this.treatShiftNumpadEqual) {
            switch(key) {
                case Key.NUMPAD_DELETE: key = Key.NUMPAD_PERIOD; break;
                case Key.NUMPAD_INSERT: key = Key.NUMPAD_0; break;
                case Key.NUMPAD_END: key = Key.NUMPAD_1; break;
                case Key.NUMPAD_ARROW_DOWN: key = Key.NUMPAD_2; break;
                case Key.NUMPAD_PAGE_DOWN: key = Key.NUMPAD_3; break;
                case Key.NUMPAD_ARROW_LEFT: key = Key.NUMPAD_4; break;
                case Key.NUMPAD_CLEAR: key = Key.NUMPAD_5; break;
                case Key.NUMPAD_ARROW_RIGHT: key = Key.NUMPAD_6; break;
                case Key.NUMPAD_HOME: key = Key.NUMPAD_7; break;
                case Key.NUMPAD_ARROW_UP: key = Key.NUMPAD_8; break;
                case Key.NUMPAD_PAGE_UP: key = Key.NUMPAD_9; break;
            }
        }

        return key;
    }

    load() {
        const controls = localStorage.getItem("controls");
        if (controls) {
            this.controls = new Map(JSON.parse(controls));
        } else {
            this.resetToDefault();
        }
    }

    save() {
        localStorage.setItem("controls", JSON.stringify(Array.from(this.controls.entries())));
    }

    setControls(controlsMap) {
        this.controls = new Map();
        for (const [key, value] of controlsMap.entries()) {
            const keys = [];
            for (const val of value) {
                keys.push(val);
            }
            this.controls.set(key, keys);
        }
        this.save();
    }

    resetToDefault() {
        this.setControls(this.defaults);
    }

    clone() {
        const clone = new Map();
        for (const [key, value] of this.controls.entries()) {
            const keys = [];
            for (const val of value) {
                keys.push(val);
            }
            clone.set(key, keys);
        }
        return clone;
    }

    isPressed(key) {
        const self = this;
        let pressed = false;

        let keys = self.controls.get(key);
        if (!keys) {
            const defaultKeys = self.defaults.get(key);
            if (defaultKeys) {
                self.controls.set(key, defaultKeys);
                self.save();
                keys = defaultKeys;
            } else {
                console.error("Missing keybindings for: ", key, keys);
            }
        }
        keys.forEach(function(keyToTest) {
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
/*
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
*/
}

const controls = new Controls();
export default controls;


// window.addEventListener("gamepadconnected", function(e) {
//     const gamepad = navigator.getGamepads()[e.gamepad.index];
//     console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.", gamepad.index, gamepad.id, gamepad.buttons.length, gamepad.axes.length);
//     console.log(gamepad.buttons);
// });
//
// window.addEventListener("gamepaddisconnected", function(e) {
//     /*
//     var gamepad = navigator.getGamepads()[e.gamepad.index];
//     console.log("Gamepad disconnected at index %d: %s. %d buttons, %d axes.", gamepad.index, gamepad.id, gamepad.buttons.length, gamepad.axes.length);
//     */
// });