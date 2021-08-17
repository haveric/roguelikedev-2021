import _Component from "../_Component";
import Extend from "../../util/Extend";
import EquipmentType from "./EquipmentType";
import entityLoader from "../../entity/EntityLoader";
import engine from "../../Engine";
import messageConsole from "../../ui/MessageConsole";
import inventory from "../../ui/Inventory";

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
        this.strength = 0;
        this.agility = 0;
        this.constitution = 0;
        this.wisdom = 0;
        this.lightRadius = 0;
        this.maxStorage = 0;
        this.storage = [];

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

            if (equippable.strength !== undefined) {
                this.strength = this.parseRandIntBetween(equippable.strength);
            }

            if (equippable.agility !== undefined) {
                this.agility = this.parseRandIntBetween(equippable.agility);
            }

            if (equippable.constitution !== undefined) {
                this.constitution = this.parseRandIntBetween(equippable.constitution);
            }

            if (equippable.wisdom !== undefined) {
                this.wisdom = this.parseRandIntBetween(equippable.wisdom);
            }

            if (equippable.lightRadius !== undefined) {
                this.lightRadius = this.parseRandIntBetween(equippable.lightRadius);
            }

            if (equippable.maxStorage !== undefined) {
                this.maxStorage = equippable.maxStorage;
            }

            if (equippable.storage !== undefined) {
                for (let i = 0; i < equippable.storage.length; i++) {
                    const item = equippable.storage[i];
                    if (item !== null) {
                        if (item.load !== undefined) {
                            this.storage[i] = entityLoader.createFromTemplate(item.load, item);
                        } else {
                            this.storage[i] = entityLoader.create(item);
                        }
                        this.storage[i].parentEntity = this;
                    }
                }
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

        if (this.strength !== 0) {
            saveJson.equippable.strength = this.strength;
        }

        if (this.agility !== 0) {
            saveJson.equippable.agility = this.agility;
        }

        if (this.constitution !== 0) {
            saveJson.equippable.constitution = this.constitution;
        }

        if (this.wisdom !== 0) {
            saveJson.equippable.wisdom = this.wisdom;
        }

        if (this.lightRadius !== 0) {
            saveJson.equippable.lightRadius = this.lightRadius;
        }

        if (this.maxStorage !== 0) {
            saveJson.equippable.maxStorage = this.maxStorage;
        }

        const storageJson = [];
        for (const item of this.storage) {
            if (!item) {
                storageJson.push(null);
            } else {
                storageJson.push(JSON.stringify(item.save()));
            }
        }

        if (storageJson.length > 0) {
            saveJson.equippable.storage = storageJson;
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

        if (this.strength !== 0) {
            description += "<span class='item__details-line'>Strength: <span style='color: #fff;'>+" + this.strength + "</span></span>";
        }

        if (this.agility !== 0) {
            description += "<span class='item__details-line'>Agility: <span style='color: #fff;'>+" + this.agility + "</span></span>";
        }

        if (this.constitution !== 0) {
            description += "<span class='item__details-line'>Constitution: <span style='color: #fff;'>+" + this.constitution + "</span></span>";
        }

        if (this.wisdom !== 0) {
            description += "<span class='item__details-line'>Wisdom: <span style='color: #fff;'>+" + this.wisdom + "</span></span>";
        }

        if (this.lightRadius !== 0) {
            description += "<span class='item__details-line'>Light Radius: <span style='color: #fff;'>+" + this.lightRadius + "</span></span>";
        }

        if (this.maxStorage === -1) {
            description += "<span class='item__details-line'>Storage: <span style='color: #fff;'>Unlimited</span></span>";
        } else if (this.maxStorage > 0) {
            description += "<span class='item__details-line'>Storage: <span style='color: #fff;'>" + this.maxStorage + "</span></span>";
        }

        return description;
    }

    addFullStacks(item) {
        this.clearSaveCache();

        // Add full stack
        if (this.maxStorage === -1) {
            this.storage[this.storage.length] = item;
            item.parentEntity = this;
        } else {
            for (let i = 0; i < this.maxStorage; i++) {
                if (!this.storage[i]) {
                    this.storage[i] = item;
                    item.parentEntity = this;
                    return true;
                }
            }
        }

        return false;
    }

    addPartialStacks(item) {
        if (item.amount <= 0) {
            return false;
        }
        this.clearSaveCache();

        const originalAmount = item.amount;
        let amountToAdd = item.amount;

        let partialMax;
        if (this.maxStorage === -1) {
            partialMax = this.storage.length;
        } else {
            partialMax = this.maxStorage;
        }
        // Add partial stack
        for (let i = 0; i < partialMax; i++) {
            const inventoryItem = this.storage[i];
            if (inventoryItem) {
                if (item.id === inventoryItem.id) {
                    let amountCanAdd = inventoryItem.maxStackSize - inventoryItem.amount;
                    if (amountCanAdd >= amountToAdd) {
                        inventoryItem.setAmount(inventoryItem.amount + amountToAdd);
                        return true;
                    } else {
                        inventoryItem.setAmount(inventoryItem.amount + amountCanAdd);
                        item.setAmount(item.amount - amountCanAdd);
                        amountToAdd -= amountCanAdd;
                    }
                }
            }
        }

        return originalAmount !== amountToAdd;
    }

    use(item, amount) {
        item.setAmount(item.amount - amount);
        if (item.amount <= 0) {
            this.remove(item);
        }

        this.clearSaveCache();
    }

    remove(item) {
        const index = this.storage.indexOf(item);
        if (index > -1) {
            this.storage.splice(index, 1, null);
        }

        this.clearSaveCache();
        engine.needsMapUpdate = true;
    }

    setItem(index, item) {
        this.storage[index] = item;
        this.clearSaveCache();
    }

    move(fromIndex, toIndex) {
        if (fromIndex !== toIndex) {
            const fromItem = this.storage[fromIndex];

            this.storage[fromIndex] = this.storage[toIndex];
            this.storage[toIndex] = fromItem;

            this.clearSaveCache();
            if (this.isPlayer()) {
                inventory.populateInventory(engine.player);
            }
        }
    }

    drop(item) {
        if (item) {
            let parent = this.parentEntity;
            while (parent.type !== 'actor') {
                parent = parent.parentEntity;
            }
            const parentPosition = parent.getComponent("positionalobject");
            engine.gameMap.addItem(item, parentPosition)

            if (parent === engine.player) {
                messageConsole.text("You dropped the " + item.name).build();
            }

            this.remove(item);
            this.clearSaveCache();
            if (parent === engine.player) {
                inventory.populateInventory(engine.player);
            }
        }
    }
}