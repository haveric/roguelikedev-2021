import html from "../../../html/ui/editor/EditorControls.html";
import UIElement from "../UIElement";

class EditorControls extends UIElement {
    constructor() {
        super(html);

        this.addAction("select", "👆", true);
        this.addAction("paint", "🖌");
        this.addAction("delete", "⌫");

        this.activeAction = "select";

        this.dom.addEventListener("click", this);
    }

    handleEvent(e) {
        switch(e.type) {
            case "click":
                this.setControl(e);
                break;
        }
    }

    addAction(subId, char, active) {
        const action = document.createElement("button");
        action.id = "editor-controls-" + subId;
        action.setAttribute("data-action", subId);
        action.classList.add("editor-controls__action");
        if (active) {
            action.classList.add("active");
        }
        action.innerHTML = char;

        this.dom.appendChild(action);
    }

    setControl(e) {
        const target = e.target;
        if (target.type === "submit") {
            if (!target.classList.contains("active")) {
                const allActions = target.parentNode.children;
                for (const action of allActions) {
                    action.classList.remove("active");
                }

                this.activeAction = target.getAttribute("data-action");
                target.classList.add("active");
            }
        }

    }
}

const editorControls = new EditorControls();
export default editorControls;