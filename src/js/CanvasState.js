export default class CanvasState {
    constructor() {
        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas);
        this.context = this.canvas.getContext('2d');

        this.oldFillStyle = "none";
        this.oldFont = "";
    }

    prepareToDraw() {
        this.updateSize();
        this.clear();
    }

    updateSize() {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;

        if (this.width !== newWidth) {
            this.width = newWidth;
            this.canvas.width = newWidth;
        }

        if (this.height !== newHeight) {
            this.height = newHeight;
            this.canvas.height = newHeight;
        }
    }

    setFillStyle(newFillStyle) {
        if (newFillStyle !== this.oldFillStyle) {
            this.context.fillStyle = newFillStyle;
            this.oldFillStyle = newFillStyle;
        }
    }

    setFont(newFont) {
        if (newFont !== this.oldFont) {
            this.context.font = newFont;
        }
    }

    clear() {
        this.setFillStyle("#000000");
        this.context.fillRect(0, 0, this.width, this.height);
    }
}

