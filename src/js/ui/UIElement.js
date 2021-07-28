export default class UIElement {
    constructor(html) {
        this.dom = this.htmlToElement(html);
    }

    /**
     * Reference: https://stackoverflow.com/a/35385518
     * @param {String} html HTML representing a single element
     * @return {Element}
     */
    htmlToElement(html) {
        const template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }

    // /**
    //  * Reference: https://stackoverflow.com/a/35385518
    //  * @param {String} html HTML representing any number of sibling elements
    //  * @return {NodeList}
    //  */
    // htmlToElements(html) {
    //     const template = document.createElement('template');
    //     template.innerHTML = html;
    //     return template.content.childNodes;
    // }

    isOpen() {
        return this.dom.classList.contains("active");
    }

    open() {
        if (!this.dom.classList.contains("active")) {
            this.dom.classList.add("active");
        }
    }

    close() {
        this.dom.classList.remove("active");
    }
}