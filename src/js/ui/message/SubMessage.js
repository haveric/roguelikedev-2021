export default class SubMessage {
    constructor(text, color, options) {
        this.text = text;
        this.color = color || "#333";

        this.bold = false;
        this.italics = false;
        if (options) {
            this.bold = options.bold || false;
            this.italics = options.italics || false;
        }
    }

    isEqual(subMessage) {
        return this.text === subMessage.text && this.color === subMessage.color && this.bold === subMessage.bold && this.italics === subMessage.italics;
    }
}