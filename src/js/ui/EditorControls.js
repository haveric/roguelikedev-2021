import EditorUIElement from "./_EditorUIElement";

class EditorControls extends EditorUIElement{
    constructor() {
        super("editor-controls");

        this.addAction("select", "👆", true);
        this.addAction("paint", "🖌");
        this.addAction("delete", "⌫");

        this.activeAction = "select";

        this.domElement.addEventListener("click", this);
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

        this.domElement.appendChild(action);
    }

    setControl(e) {
        const target = e.target;
        if (target.type === "submit") {
            if (!target.classList.contains("active")) {
                const allActions = target.parentNode.childNodes;
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