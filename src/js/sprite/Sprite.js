import textures from "./Textures";
import canvasState from "../CanvasState";

export default class Sprite {
    constructor(textureName, x, y, w, h) {
        this.textureName = textureName;
        this.texture = textures.get(textureName);
        this.x = x || 0;
        this.y = y || 0;
        this.w = w || 32;
        this.h = h || 32;
    }

    loadTexture() {
        if (this.texture == null) {
            this.texture = textures.get(this.textureName);
        }

        return this.texture != null;
    }

    drawImage(i, j, degrees) {
        const context = canvasState.context;
        if (degrees != null && degrees > 0) {
            context.save();
            context.translate(i+this.w/2, j+this.h/2);
            context.rotate(degrees * Math.PI / 180);

            context.drawImage(this.texture.image, this.x, this.y, this.w, this.h, -this.w/2, -this.h/2, this.w * 2, this.h*2);

            context.restore();
        } else {
            context.drawImage(this.texture.image, this.x, this.y, this.w, this.h, i, j, this.w, this.h);
        }
    }
}