import * as THREE from "three";
import Stats from "stats.js";
import _Tile from "./entity/_Tile";
import engine from "./Engine";

class SceneState {
    constructor() {
        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
        this.renderer.setClearColor( 0xaaaaaa, 1 );
        document.body.appendChild( this.renderer.domElement );

        this.setupLights();
        this.updateCamera();

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.highlightedTile = null;

        this.stats = new Stats();
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);

        window.addEventListener( 'resize', this);
        window.addEventListener("mousemove", this);
    }

    handleEvent(e) {
        switch(e.type) {
            case "resize":
                this.updateCamera();

                if (this.player) {
                    this.updateCameraPosition(this.player);
                }
                break;
            case "mousemove":
                this.onMouseMove(e);
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

        const viewSize = 100;
        const left = -aspectRatio * viewSize / 2
        const right = aspectRatio * viewSize / 2;
        const top = viewSize / 2;
        const bottom = -viewSize / 2;
        this.camera = new THREE.OrthographicCamera(left, right, top, bottom, -10000, 10000);
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    updateCameraPosition(player) {
        this.player = player;
        this.camera.up.set(0, 0, 1);
        const playerObject = player.getComponent("positionalobject");

        this.camera.position.set(200 + playerObject.object.position.x, -200 + playerObject.object.position.y, 300);
        this.camera.lookAt(playerObject.object.position.x, playerObject.object.position.y, 0);
    }

    onMouseMove(e) {
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersects = this.raycaster.intersectObject(this.scene, true);

        let anyFound = false;
        for (let i = 0; i < intersects.length; i++) {
            const object = intersects[i].object;
            const parentEntity = object.parentEntity;
            if (parentEntity && parentEntity instanceof _Tile) {
                const parentObject = parentEntity.getComponent("positionalobject");
                if (parentObject && !parentObject.highlighted) {
                    if (this.highlightedTile !== null) {
                        const object = this.highlightedTile.getComponent("positionalobject");
                        if (object) {
                            object.removeHighlight();
                        }
                    }
                    this.highlightedTile = parentEntity;
                    parentObject.highlight();
                }

                anyFound = true;
                break;
            }
        }

        if (!anyFound) {
            if (this.highlightedTile !== null) {
                const object = this.highlightedTile.getComponent("positionalobject");
                if (object) {
                    object.removeHighlight();
                }
            }
        }

        engine.needsMapUpdate = true;
    }
}


const sceneState = new SceneState();
export default sceneState;