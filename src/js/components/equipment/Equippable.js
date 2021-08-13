import _Component from "../_Component";
import Extend from "../../util/Extend";
import EquipmentType from "./EquipmentType";

export default class Equippable extends _Component {
    constructor(args = {}) {
        super(Extend.extend(args, {baseType: "equippable"}));
        const hasComponent = args.components && args.components.equippable !== undefined;
        this.slot = EquipmentType.MAIN_HAND;
        this.minDamage = 0;
        this.maxDamage = 0;
        this.defense = 0;
        this.blockChance = 0;
        this.health = 0;
        this.mana = 0;
        this.lightRadius = 0;

        if (hasComponent) {
            const equippable = args.components.equippable;
            if (equippable.slot !== undefined) {
                this.slot = equippable.slot;
            }

            const damage = equippable.damage;
            if (damage !== undefined) {
                if (typeof damage === "string") {
                    const damageSplit = damage.split(",");
                    this.minDamage = this.parseRandIntBetween(damageSplit[0]);

                    if (damageSplit.length > 1) {
                        this.maxDamage = this.parseRandIntBetween(damageSplit[1]);
                    } else {
                        this.maxDamage = this.minDamage;
                    }
                } else {
                    this.minDamage = damage;
                    this.maxDamage = this.minDamage;
                }
            }

            if (equippable.defense !== undefined) {
                this.defense = this.parseRandIntBetween(equippable.defense);
            }

            if (equippable.blockChance !== undefined) {
                this.blockChance = this.parseRandIntBetween(equippable.blockChance);
            }

            if (equippable.health !== undefined) {
                this.health = this.parseRandIntBetween(equippable.health);
            }

            if (equippable.mana !== undefined) {
                this.mana = this.parseRandIntBetween(equippable.mana);
            }

            if (equippable.lightRadius !== undefined) {
                this.lightRadius = this.parseRandIntBetween(equippable.lightRadius);
            }
        }
    }

    save() {
        if (this.cachedSave) {
            return this.cachedSave;
        }

        const saveJson = {
            equippable: {}
        };

        if (this.slot !== EquipmentType.MAIN_HAND) {
            saveJson.equippable.slot = this.slot;
        }

        if (this.minDamage !== 0 || this.maxDamage !== 0) {
            if (this.minDamage === this.maxDamage) {
                saveJson.equippable.damage = this.minDamage;
            } else {
                saveJson.equippable.damage = this.minDamage + "," + this.maxDamage;
            }
        }

        if (this.defense !== 0) {
            saveJson.equippable.defense = this.defense;
        }

        if (this.blockChance !== 0) {
            saveJson.equippable.blockChance = this.blockChance;
        }

        if (this.health !== 0) {
            saveJson.equippable.health = this.health;
        }

        if (this.mana !== 0) {
            saveJson.equippable.mana = this.mana;
        }

        if (this.lightRadius !== 0) {
            saveJson.equippable.lightRadius = this.lightRadius;
        }

        this.cachedSave = saveJson;
        return saveJson;
    }

    getDescription() {
        let description = "<span class='item__details-line'>Type: <span style='color: #fff;'>" + this.slot + "</span></span>";

        if (this.minDamage !== 0 || this.maxDamage !== 0) {
            description += "<span class='item__details-line'>Damage: <span style='color: #f00;'>";
            if (this.minDamage === this.maxDamage) {
                description += this.minDamage;
            } else {
                description += this.minDamage + " - " + this.maxDamage;
            }
            description += "</span></span>";
        }

        if (this.defense !== 0) {
            description += "<span class='item__details-line'>Defense: <span style='color: #fff;'>" + this.defense + "</span></span>";
        }

        if (this.blockChance !== 0) {
            description += "<span class='item__details-line'>Block Chance: <span style='color: #fff;'>" + this.blockChance + "</span></span>";
        }

        if (this.health !== 0) {
            description += "<span class='item__details-line'>Health: <span style='color: #fff;'>+" + this.health + "</span></span>";
        }

        if (this.mana !== 0) {
            description += "<span class='item__details-line'>Mana: <span style='color: #fff;'>+" + this.mana + "</span></span>";
        }

        if (this.lightRadius !== 0) {
            description += "<span class='item__details-line'>Light Radius: <span style='color: #fff;'>+" + this.lightRadius + "</span></span>";
        }

        return description;
    }
}