import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

class SceneState {
    constructor() {
        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild( this.renderer.domElement );

        this.setupLights();
        this.updateCamera();

        window.addEventListener( 'resize', this);
    }

    handleEvent(e) {
        switch(e.type) {
            case "resize":
                this.updateCamera();
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
        const aspectRatio = window.innerWidth / window.innerHeight;
        const cameraWidth = 150;
        const cameraHeight = cameraWidth / aspectRatio;

        this.camera = new THREE.OrthographicCamera(cameraWidth / -2, cameraWidth / 2, cameraHeight / 2, cameraHeight / -2, 0, 1000);
        this.camera.position.set(200, -200, 300);
        this.camera.up.set(0, 0, 1);
        this.camera.lookAt(0, 0, 0);

        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        controls.target.set(0, 5, 0);
        controls.update();

        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }
}


const sceneState = new SceneState();
export default sceneState;