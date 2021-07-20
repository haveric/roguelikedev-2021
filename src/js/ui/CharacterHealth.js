class CharacterHealth {
    constructor() {
        this.dom = document.createElement("div");
        this.dom.classList.add("character-info");
        this.dom.id = "character-health";

        this.wrapDom = document.createElement("div");
        this.wrapDom.classList.add("character-info__wrap");

        this.bgDom = document.createElement("div");
        this.bgDom.classList.add("character-info__bg");
        this.bgDom.innerText = "@";

        this.fgDom = document.createElement("div");
        this.fgDom.classList.add("character-info__fg");
        this.fgDom.innerText = "@";

        this.textDom = document.createElement("div");
        this.textDom.classList.add("character-info__text");

        this.wrapDom.appendChild(this.bgDom);
        this.wrapDom.appendChild(this.fgDom);
        this.wrapDom.appendChild(this.textDom);
        this.dom.appendChild(this.wrapDom);
    }

    update(current, max) {
        const percent = current / max;
        const height = percent * 80;
        this.fgDom.style.height = height + "%";

        this.textDom.innerText = current + " / " + max;
    }
}

const characterHealth = new CharacterHealth();
export default characterHealth;