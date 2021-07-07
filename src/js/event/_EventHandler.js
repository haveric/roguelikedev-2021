import * as THREE from "three";
import sceneState from "../SceneState";

export default class EventHandler {
    constructor() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.mouseDown = false;

        window.addEventListener("mousemove", this);
        window.addEventListener("mousedown", this);
        window.addEventListener("mouseup", this);
        window.addEventListener("click", this);
        window.addEventListener("contextmenu", this);
    }

    teardown() {
        window.removeEventListener("mousemove", this);
        window.removeEventListener("mousedown", this);
        window.removeEventListener("mouseup", this);
        window.removeEventListener("click", this);
        window.removeEventListener("contextmenu", this);
    }

    handleEvent(e) {
        switch(e.type) {
            case "mousemove":
                this.onMouseMove(e);
                break;
            case "mousedown":
                this.onMouseDown(e);
                break;
            case "mouseup":
                this.onMouseUp(e);
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

    onMouseDown(e) {
        this.mouseDown = true;
    }

    onMouseUp(e) {
        this.mouseDown = false;
    }

    onLeftClick(e) {}

    onRightClick(e) {}

    getMouseIntersectingObjects(e) {
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, sceneState.camera);

        return this.raycaster.intersectObject(sceneState.scene, true);
    }
}