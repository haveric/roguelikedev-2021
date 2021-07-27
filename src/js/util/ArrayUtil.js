export default class ArrayUtil {
    constructor() {

    }

    static create2dArray(numRows) {
        const array = [];

        for (let i = 0; i < numRows; i++) {
            array[i] = [];
        }
        return array;
    }
}