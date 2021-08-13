import _Component from "../_Component";
import Extend from "../../util/Extend";
import EquipmentType from "./EquipmentType";
import EquipmentSlot from "./EquipmentSlot";
import entityLoader from "../../entity/EntityLoader";
import engine from "../../Engine";
import messageConsole from "../../ui/MessageConsole";

export default class Equipment extends _Component {
    constructor(args = {}) {
        super(Extend.extend(args, {baseType: "equipment"}));
        const hasComponent = args.components && args.components.equipment !== undefined;

        this.items = [];
        this.items.push(new EquipmentSlot(EquipmentType.SHOULDER));
        this.items.push(new EquipmentSlot(EquipmentType.HELMET));
        this.items.push(new EquipmentSlot(EquipmentType.AMULET));
        this.items.push(new EquipmentSlot(EquipmentType.MAIN_HAND));
        this.items.push(new EquipmentSlot(EquipmentType.BODY));
        this.items.push(new EquipmentSlot(EquipmentType.OFF_HAND));
        this.items.push(new EquipmentSlot(EquipmentType.RING));
        this.items.push(new EquipmentSlot(EquipmentType.BELT));
        this.items.push(new EquipmentSlot(EquipmentType.RING));
        this.items.push(new EquipmentSlot(EquipmentType.STORAGE));
        this.items.push(new EquipmentSlot(EquipmentType.BOOTS));
        this.items.push(new EquipmentSlot(EquipmentType.GLOVES));

        if (hasComponent) {
            const equipment = args.components.equipment;
            if (equipment.items !== undefined) {
                for (let i = 0; i < equipment.items.length; i++) {
                    const item = equipment.items[i];
                    if (item !== null) {
                        if (item.load !== undefined) {
                            this.items[i].item = entityLoader.createFromTemplate(item.load);
                        } else {
                            this.items[i].item = entityLoader.create(item);
                        }
                        this.items[i].item.parent = this;
                    }
                }
            }
        }
    }

    save() {
        if (this.cachedSave) {
            return this.cachedSave;
        }

        const itemJson = [];
        for (const equipmentSlot of this.items) {
            const item = equipmentSlot.item;
            if (!item) {
                itemJson.push(null);
            } else {
                itemJson.push(JSON.stringify(item.save()));
            }
        }

        const saveJson = {
            equipment: {
                items: itemJson
            }
        };

        this.cachedSave = saveJson;
        return saveJson;
    }

    getEquippables() {
        const equippables = [];
        for (const equipmentItem of this.items) {
            const item = equipmentItem.item;
            if (item) {
                const equippable = item.getComponent("equippable");
                if (equippable) {
                    equippables.push(equippable);
                }
            }
        }

        return equippables;
    }

    move(fromIndex, toIndex) {
        if (fromIndex !== toIndex) {
            const fromItem = this.items[fromIndex].item;

            this.items[fromIndex].item = this.items[toIndex].item;
            this.items[toIndex].item = fromItem;

            this.clearSaveCache();
        }
    }

    drop(item) {
        if (item) {
            const parentPosition = this.parentEntity.getComponent("positionalobject");
            engine.gameMap.addItem(item, parentPosition)

            if (this.isPlayer()) {
                messageConsole.text("You dropped the " + item.name).build();
            }

            this.remove(item);
            this.clearSaveCache();
        }
    }

    remove(item) {
        for (let i = 0; i < this.items.length; i++) {
            const equipmentItem = this.items[i];
            if (equipmentItem && equipmentItem.item === item) {
                equipmentItem.item = null;
                this.clearSaveCache();
                engine.needsMapUpdate = true;
                break;
            }
        }
    }

    setItem(index, item) {
        this.items[index].item = item;
        this.clearSaveCache();
    }

    getItem(index) {
        return this.items[index].item;
    }
}