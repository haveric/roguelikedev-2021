import Texture from "./Texture";

class Textures {
    constructor() {
        this.textures = new Map();
    }

    add(name, src) {
        const self = this;
        const image = new Image();

        image.onload = function () {
            self.textures.set(name, new Texture(image));
        };
        image.src = src;
    }

    get(name) {
        if (this.textures.has(name)) {
            return this.textures.get(name);
        }

        return null;
    }
}

const textures = new Textures();
export default textures;