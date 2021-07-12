/**
 * Adapted from http://youmightnotneedjquery.com/
 */
export default class Extend {
    constructor() {}

    static extend(out) {
        out = out || {};

        for (let i = 1; i < arguments.length; i++) {
            if (!arguments[i]) {
                continue;
            }

            for (const key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key)) {
                    out[key] = arguments[i][key];
                }
            }
        }

        return out;
    }

    static deep(out) {
        out = out || {};

        for (let i = 1; i < arguments.length; i++) {
            const obj = arguments[i];

            if (!obj) {
                continue;
            }

            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (typeof obj[key] === 'object'){
                        if (obj[key] instanceof Array) {
                            out[key] = obj[key].slice(0);
                        } else {
                            out[key] = Extend.deep(out[key], obj[key]);
                        }
                    } else {
                        if (typeof out === 'boolean' && out[key] === undefined) {
                            out = obj[key];
                        } else {
                            out[key] = obj[key];
                        }
                    }
                }
            }
        }

        return out;
    }
}