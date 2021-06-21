import Sprite from "./Sprite";

class Sprites {
    constructor() {
        this.sprites = new Map();
        this.spritesPreloaded = false;
    }

    add(imageName, textureName, x, y, w, h) {
        this.sprites.set(imageName, new Sprite(textureName, x, y, w, h));
    }

    get(name) {
        if (this.sprites.has(name)) {
            return this.sprites.get(name);
        }

        return null;
    }

    preload() {
        if (!this.spritesPreloaded) {
            const numSprites = this.sprites.size;
            let numLoaded = 0;

            this.sprites.forEach((sprite) => {
                if (sprite.loadTexture()) {
                    numLoaded ++;
                }
            });

            if (numLoaded === numSprites) {
                this.spritesPreloaded = true;
            }
        }

        return this.spritesPreloaded;
    }
}

const sprites = new Sprites();
export default sprites;