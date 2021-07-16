import _Component from "./_Component";
import Extend from "../util/Extend";

export default class Fighter extends _Component {
    constructor(args = {}) {
        super(Extend.extend(args, {baseType: "fighter"}));
        const hasComponent = args.components && args.components.fighter !== undefined;

        this.hp = 30;
        this.maxHp = 30;
        this.defense = 0;
        this.power = 2;

        if (hasComponent) {
            const fighter = args.components.fighter;
            if (fighter.hp !== undefined) {
                this.hp = fighter.hp;
            }

            if (fighter.maxHp !== undefined) {
                this.maxHp = fighter.maxHp;
            }

            if (fighter.defense !== undefined) {
                this.defense = fighter.defense;
            }

            if (fighter.power !== undefined) {
                this.power = fighter.power;
            }
        }
    }

    save() {
        return {
            fighter: {
                hp: this.hp,
                maxHp: this.maxHp,
                defense: this.defense,
                power: this.power
            }
        }
    }
}