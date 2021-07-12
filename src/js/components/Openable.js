import _Component from "./_Component";
import entityLoader from "../entity/EntityLoader";
import engine from "../Engine";
import MapLayer from "../map/MapLayer";
import Extend from "../util/Extend";

export default class Openable extends _Component {
    constructor(args = {}) {
        super(Extend.extend(args, {baseType: "openable"}));
        const hasComponent = args.components && args.components.openable;

        this.isOpen = false;
        this.openEntity = null;
        this.closedEntity = null;

        if (hasComponent) {
            this.isOpen = args.components.openable.isOpen || false;
            this.openEntity = args.components.openable.openEntity;
            this.closedEntity = args.components.openable.closedEntity;
        }
    }

    save() {
        return {
            openable: {
                isOpen: this.isOpen,
                openEntity: this.openEntity,
                closedEntity: this.closedEntity
            }
        }
    }

    open() {
        if (!this.isOpen) {
            this.isOpen = true;

            const position = this.parentEntity.getComponent("positionalobject");
            if (position) {
                position.teardown();
                this.parentEntity = entityLoader.createFromTemplate(this.openEntity, {components: {positionalobject: {x: position.x, y: position.y, z: position.z}}});
                engine.gameMap.tiles.get(MapLayer.Wall)[position.x][position.y] = this.parentEntity;
            }

            return true;
        }

        return false;
    }

    close() {
        if (this.isOpen) {
            this.isOpen = false;

            const position = this.parent.getComponent("positionalobject");
            if (position) {
                position.teardown();
                this.parentEntity = entityLoader.create(this.closedEntity, {components: {positionalobject: {x: position.x, y: position.y, z: position.z}}});
                engine.gameMap.tiles.get(MapLayer.Wall)[position.x][position.y] = this.parent;
            }

            return true;
        }

        return false;
    }
}