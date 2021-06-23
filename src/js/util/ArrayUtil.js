export default class ArrayUtil {
    constructor() {

    }

    static randomizeArray(array) {
        let currentIndex = array.length;
        let temp;
        let randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temp = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = array[temp];
        }

        return array;
    }

    static create2dArray(numRows) {
        const array = [];

        for (let i = 0; i < numRows; i++) {
            array[i] = [];
        }
        return array;
    }
}