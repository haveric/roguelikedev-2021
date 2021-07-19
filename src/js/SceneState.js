import * as THREE from "three";
import Stats from "stats.js";
import engine from "./Engine";
import messageConsole from "./ui/MessageConsole";

class SceneState {
    constructor() {
        this.scene = new THREE.Scene();

        this.setupGameHtml();

        this.setupLights();
        this.updateCamera();

        window.addEventListener( 'resize', this);
    }

    setupGameHtml() {
        const gameDom = document.createElement("div");
        gameDom.classList.add("game");

        this.canvasDom = document.createElement("div");
        this.canvasDom.classList.add("view");

        const detailsDom = document.createElement("div");
        detailsDom.classList.add("details");

        gameDom.appendChild(this.canvasDom);
        gameDom.appendChild(detailsDom);
        gameDom.appendChild(messageConsole.consoleDom);

        this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
        this.renderer.setClearColor(0xaaaaaa, 1);
        this.canvasDom.appendChild(this.renderer.domElement);
        document.body.appendChild(gameDom);

        this.stats = new Stats();
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);

    }

    handleEvent(e) {
        switch(e.type) {
            case "resize":
                this.updateCamera();

                if (this.player) {
                    this.updateCameraPosition(this.player);
                }
                break;
        }
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
        dirLight.position.set(100, -300, 400);
        this.scene.add(dirLight);
    }

    updateCamera() {
        const aspectRatio = this.canvasDom.offsetWidth / this.canvasDom.offsetHeight;

        const viewSize = 80;
        const left = -aspectRatio * viewSize / 2
        const right = aspectRatio * viewSize / 2;
        const top = viewSize / 2;
        const bottom = -viewSize / 2;
        this.camera = new THREE.OrthographicCamera(left, right, top, bottom, -10000, 10000);
        this.renderer.setSize(this.canvasDom.offsetWidth, this.canvasDom.offsetHeight);
    }

    updateCameraPosition(player) {
        this.player = player;
        this.camera.up.set(0, 0, 1);
        const playerObject = player.getComponent("positionalobject");

        this.camera.position.set(200 + playerObject.object.position.x, -200 + playerObject.object.position.y, 300);
        this.camera.lookAt(playerObject.object.position.x, playerObject.object.position.y, 0);
        engine.needsMapUpdate = true;
    }
}


const sceneState = new SceneState();
export default sceneState;