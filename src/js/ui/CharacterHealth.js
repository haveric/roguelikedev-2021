class CharacterHealth {
    constructor() {
        this.dom = document.createElement("div");
        this.dom.id = "character-info";

        this.healthDom = document.createElement("div");
        this.healthDom.classList.add("character-info__health");

        this.healthBGDom = document.createElement("div");
        this.healthBGDom.classList.add("character-info__healthbg");
        this.healthBGDom.innerText = "@";

        this.healthFGDom = document.createElement("div");
        this.healthFGDom.classList.add("character-info__healthfg");
        this.healthFGDom.innerText = "@";

        this.healthTextDom = document.createElement("div");
        this.healthTextDom.classList.add("character-info__healthtext");

        this.healthDom.appendChild(this.healthBGDom);
        this.healthDom.appendChild(this.healthFGDom);
        this.healthDom.appendChild(this.healthTextDom);
        this.dom.appendChild(this.healthDom);
    }

    updateHealth(hp, maxHp) {
        const percentHp = hp / maxHp;
        const height = percentHp * 80;
        this.healthFGDom.style.height = height + "%";

        this.healthTextDom.innerText = hp + " / " + maxHp;
    }
}

const characterHealth = new CharacterHealth();
export default characterHealth;