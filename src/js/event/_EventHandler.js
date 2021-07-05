import * as THREE from "three";

export default class EventHandler {
    constructor() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        window.addEventListener("mousemove", this);
        window.addEventListener("click", this);
        window.addEventListener("contextmenu", this);
    }

    teardown() {
        window.removeEventListener("mousemove", this);
        window.removeEventListener("click", this);
        window.removeEventListener("contextmenu", this);
    }

    handleEvent(e) {
        switch(e.type) {
            case "mousemove":
                this.onMouseMove(e);
                break;
            case "click":
                this.onLeftClick(e);
                break;
            case "contextmenu":
                this.onRightClick(e);
                break;
        }
    }

    handleInput() {}

    onMouseMove(e) {}
    onLeftClick(e) {}
    onRightClick(e) {}
}