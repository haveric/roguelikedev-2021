import engine from "../Engine";
import {MathUtils} from "three";

export default class _Component {
    constructor(args = {}, baseType, type) {
        this.baseType = baseType || "component";
        this.type = type || this.baseType;
        this.parentEntity = args.parentEntity;

        this.cachedSave = null;
    }

    save() {
        return null;
    }

    clearSaveCache() {
        this.cachedSave = null;
        this.parentEntity?.clearSaveCache();
    }

    getDescription() {
        return "";
    }

    isPlayer() {
        return this.parentEntity === engine.player;
    }

    parseRandFloat(value, defaultValue) {
        let returnValue;
        if (typeof value === "string") {
            if (value.indexOf(",") !== -1) {
                const valueSplit = value.split(",");
                returnValue = parseFloat(MathUtils.randFloat(parseFloat(valueSplit[0].trim()), parseFloat(valueSplit[1].trim())).toFixed(2));
            } else {
                returnValue = parseFloat(value) || defaultValue;
            }
        } else {
            returnValue = value || defaultValue;
        }

        return returnValue;
    }


    parseRandInt(value, defaultValue) {
        let returnValue;
        if (typeof value === "string") {
            if (value.indexOf(",") !== -1) {
                const valueSplit = value.split(",");
                returnValue = MathUtils.randInt(parseInt(valueSplit[0].trim()), parseInt(valueSplit[1].trim()));
            } else {
                returnValue = parseInt(value) || defaultValue;
            }
        } else {
            returnValue = value || defaultValue;
        }

        return returnValue;
    }

    parseRandIntBetween(value) {
        if (typeof value === "string") {
            const split = value.trim().split("-");
            if (split.length > 1) {
                return MathUtils.randInt(parseInt(split[0].trim()), parseInt(split[1].trim()));
            } else {
                return parseInt(split[0].trim());
            }
        } else {
            return value;
        }
    }
}