import * as THREE from "three";

class SceneState {
    constructor() {
        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        document.body.appendChild( this.renderer.domElement );

        this.setupLights();
        this.updateCamera();

        window.addEventListener( 'resize', this);
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
        const aspectRatio = window.innerWidth / window.innerHeight;
        const cameraWidth = 150;
        const cameraHeight = cameraWidth / aspectRatio;

        this.camera = new THREE.OrthographicCamera(cameraWidth / -2, cameraWidth / 2, cameraHeight / 2, cameraHeight / -2, 0, 1000);
        this.camera.position.set(200, -200, 300);
        this.camera.up.set(0, 0, 1);
        this.camera.lookAt(0, 0, 0);

        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    updateCameraPosition(player) {
        this.player = player;
        this.camera.up.set(0, 0, 1);
        const playerObject = player.getComponent("positionalobject");
        if (playerObject) {
            this.camera.position.set(200 + playerObject.object.position.x, -200 + playerObject.object.position.y, 300);
            this.camera.lookAt(playerObject.object.position.x, playerObject.object.position.y, 0);
        }
    }
}


const sceneState = new SceneState();
export default sceneState;