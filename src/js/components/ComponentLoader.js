import SolidObject from "./positionalObject/SolidObject";
import CharacterObject from "./positionalObject/CharacterObject";
import BlocksMovement from "./BlocksMovement";
import Walkable from "./Walkable";
import Fov from "./Fov";
import BlocksFov from "./BlocksFov";
import Openable from "./Openable";
import VisibilityModifier from "./VisibilityModifier";
import Fighter from "./Fighter";
import AIMeleeChase from "./ai/AIMeleeChase";
import Faction from "./Faction";
import Remnant from "./Remnant";
import AIDead from "./ai/AIDead";
import HealingConsumable from "./consumable/HealingConsumable";
import Inventory from "./Inventory";
import DamageNearestConsumable from "./consumable/DamageNearestConsumable";
import ConfusionConsumable from "./consumable/ConfusionConsumable";
import AIConfusedEnemy from "./ai/AIConfusedEnemy";
import AOEDamageConsumable from "./consumable/AOEDamageConsumable";
import ManaConsumable from "./consumable/ManaConsumable";
import AIGelatinousCube from "./ai/AIGelatinousCube";
import AIPlayer from "./ai/AIPlayer";
import ExplodeOnDeath from "./ExplodeOnDeath";
import AttachedItems from "./AttachedItems";
import StairsInteractable from "./interactable/StairsInteractable";

class ComponentLoader {
    constructor() {
        this.types = new Map();

        // AI
        this.load(new AIConfusedEnemy());
        this.load(new AIDead());
        this.load(new AIGelatinousCube());
        this.load(new AIMeleeChase());
        this.load(new AIPlayer());

        // Consumables
        this.load(new AOEDamageConsumable());
        this.load(new ConfusionConsumable());
        this.load(new DamageNearestConsumable());
        this.load(new HealingConsumable());
        this.load(new ManaConsumable());

        // Interactables
        this.load(new StairsInteractable());

        // Positionalobjects
        this.load(new CharacterObject());
        this.load(new SolidObject());

        // Default components
        this.load(new AttachedItems());
        this.load(new BlocksFov());
        this.load(new BlocksMovement());
        this.load(new ExplodeOnDeath());
        this.load(new Faction());
        this.load(new Fighter());
        this.load(new Fov());
        this.load(new Inventory());
        this.load(new Openable());
        this.load(new Remnant());
        this.load(new VisibilityModifier());
        this.load(new Walkable());
    }

    load(component) {
        this.types.set(component.type, component);
    }

    create(entity, type, args) {
        const component = this.types.get(type);
        const constructor = component.constructor;
        return new constructor(args);
    }
}

const componentLoader = new ComponentLoader();
export default componentLoader;