import EditorUIElement from "./_EditorUIElement";

class EditorLayer extends EditorUIElement{
    constructor() {
        super("editor-layer");

        const minLayer = 0;
        const maxLayer = 3;

        const minLayerDom = document.createElement("div");
        this.minInput = document.createElement("input");
        this.minInput.id = "editor-layer__min";

        const maxLayerDom = document.createElement("div");
        this.maxInput = document.createElement("input");
        this.maxInput.id = "editor-layer__max";
    }
}

const editorLayer = new EditorLayer();
export default editorLayer;