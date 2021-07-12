import _Component from "./_Component";
import entityLoader from "../entity/EntityLoader";
import engine from "../Engine";
import MapLayer from "../map/MapLayer";

export default class Openable extends _Component {
    constructor(args = {}) {
        if (args.components && args.components.openable) {
            args = {...args, ...args.components.openable};
        }
        super({...args, ...{baseType: "openable"}});

        this.isOpen = args.isOpen || false;
        this.openEntity = args.openEntity;
        this.closedEntity = args.closedEntity;
    }

    save() {
        return {
            isOpen: this.isOpen,
            openEntity: this.openEntity,
            closedEntity: this.closedEntity
        }
    }

    open() {
        if (!this.isOpen) {
            this.isOpen = true;

            const position = this.parentEntity.getComponent("positionalobject");
            if (position) {
                position.teardown();
                this.parentEntity = entityLoader.createFromTemplate(this.openEntity, {x: position.x, y: position.y, z: position.z});
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
                this.parentEntity = entityLoader.create(this.closedEntity, {x: position.x, y: position.y, z: position.z});
                engine.gameMap.tiles.get(MapLayer.Wall)[position.x][position.y] = this.parent;
            }

            return true;
        }

        return false;
    }
}