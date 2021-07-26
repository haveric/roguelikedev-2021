import engine from "../Engine";
import {MathUtils} from "three";

export default class _Component {
    constructor(args = {}) {
        this.baseType = args.baseType || "component";
        this.type = args.type || this.baseType;
        this.parentEntity = args.parentEntity;
    }

    save() {
        return null;
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
}