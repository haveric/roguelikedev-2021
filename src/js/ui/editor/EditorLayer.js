import html from "../../../html/ui/editor/EditorLayer.html";
import UIElement from "../UIElement";

class EditorLayer extends UIElement {
    constructor() {
        super(html);
    }
}

const editorLayer = new EditorLayer();
export default editorLayer;