export default class RandomUtil {
    constructor() {}

    static getRandomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}