import html from '../../../html/ui/editor/EditorPaint.html';
import UIElement from "../UIElement";

class EditorPaint extends UIElement {
    constructor() {
        super(html);
    }
}

const editorPaint = new EditorPaint();
export default editorPaint;