export default class EditorUIElement {
    constructor(id) {
        this.domElement = document.createElement("div");
        this.domElement.id = id;
        this.domElement.classList.add("editor-ui");
    }

    getElement() {
        return document.getElementById(this.domElement.id);
    }

    show() {
        const el = this.getElement();
        if (el) {
            el.classList.add("active");
        } else {
            document.body.appendChild(this.domElement);
            this.domElement.classList.add("active");
        }
    }

    hide() {
        const el = this.getElement();
        if (el) {
            el.classList.remove("active");
        }
    }
}