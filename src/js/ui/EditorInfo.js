import EditorUIElement from "./_EditorUIElement";
import engine from "../Engine";

class EditorInfo extends EditorUIElement{
    constructor() {
        super("editor-info");

        this.dataMap = new Map();

        const entityDom = document.createElement("div");
        entityDom.classList.add("editor-info__component");
        entityDom.classList.add("active");
        this.addData("entity", entityDom);
        this.addData("name", entityDom);
        this.domElement.appendChild(entityDom);

        this.positionalObject = document.createElement("div");
        this.positionalObject.classList.add("editor-info__component");
        this.addData("baseType", this.positionalObject);
        this.addData("x", this.positionalObject);
        this.addData("y", this.positionalObject);
        this.addData("z", this.positionalObject);
        this.addData("color", this.positionalObject);
        this.addDataInput("scale", this.positionalObject);

        this.addData("xRot", this.positionalObject);
        this.addData("yRot", this.positionalObject);
        this.addData("zRot", this.positionalObject);

        this.addData("xOffset", this.positionalObject);
        this.addData("yOffset", this.positionalObject);
        this.addData("zOffset", this.positionalObject);
        this.domElement.appendChild(this.positionalObject);

        this.walkable = document.createElement("div");
        this.walkable.classList.add("editor-info__component");
        this.addData("walkable", this.walkable);
        this.domElement.appendChild(this.walkable);

        this.blocksMovement = document.createElement("div");
        this.blocksMovement.classList.add("editor-info__component");
        this.addData("blocksMovement", this.blocksMovement);
        this.domElement.appendChild(this.blocksMovement);
    }

    addDataInput(id, domElement) {
        this.addData(id, domElement, "input")
    }

    addData(id, domElement, type = "text") {
        const self = this;
        const data = document.createElement("div");
        data.classList.add("editor-info__data");

        const label = document.createElement("span");
        label.classList.add("editor-info__label");
        label.innerHTML = id + ": ";
        data.appendChild(label);

        let dataDom;
        if (type === "text") {
            dataDom = document.createElement("span");
        } else if (type === "input") {
            dataDom = document.createElement("input");
            dataDom.setAttribute("tabindex", "-1");

            dataDom.onchange = function(e) {
                self.updateScale(self, e);
            }
            dataDom.onblur = function(e) {
                self.updateScale(self, e);
            }
        }
        dataDom.classList.add("editor-info__" + type);
        dataDom.id = "editor-info-" + id;
        data.appendChild(dataDom);

        domElement.appendChild(data);

        this.dataMap.set(id, dataDom);
    }

    updateScale(self, e) {
        let value = e.target.value;
        if (value < 0.1) {
            value = 0.1;
            e.target.value = value;
        } else if (value > 1) {
            value = 1;
            e.target.value = value;
        }

        if (self.entity) {
            const positionalObject = self.entity.getComponent("positionalobject");
            if (positionalObject) {
                positionalObject.scale = value;
                positionalObject.teardown();
                positionalObject.setVisible();
                engine.needsMapUpdate = true;
            }
        }
    }

    setData(id, data) {
        const domElement = this.dataMap.get(id);
        if (domElement.tagName === "INPUT") {
            domElement.value = data;
        } else {
            domElement.innerHTML = data;
        }
    }

    setDataForEntity(entity) {
        this.entity = entity;
        this.setData("entity", entity.type);
        this.setData("name", entity.name);

        const positionalObject = entity.getComponent("positionalobject");
        if (positionalObject) {
            this.positionalObject.classList.add("active");
            this.setData("x", positionalObject.x);
            this.setData("y", positionalObject.y);
            this.setData("z", positionalObject.z);

            this.setData("baseType", positionalObject.type);
            this.setData("color", positionalObject.color);
            this.setData("scale", positionalObject.scale);

            this.setData("xRot", positionalObject.xRot);
            this.setData("yRot", positionalObject.yRot);
            this.setData("zRot", positionalObject.zRot);

            this.setData("xOffset", positionalObject.xOffset);
            this.setData("yOffset", positionalObject.yOffset);
            this.setData("zOffset", positionalObject.zOffset);
        } else {
            this.positionalObject.classList.remove("active");
        }

        const walkable = entity.getComponent("walkable");
        if (walkable) {
            this.walkable.classList.add("active");
            this.setData("walkable", walkable.walkable);
        } else {
            this.walkable.classList.remove("active");
        }

        const blocksMovement = entity.getComponent("blocksMovement");
        if (blocksMovement) {
            this.blocksMovement.classList.add("active");
            this.setData("blocksMovement", blocksMovement.blocksMovement);
        } else {
            this.blocksMovement.classList.remove("active");
        }
    }
}

const editorInfo = new EditorInfo();
export default editorInfo;