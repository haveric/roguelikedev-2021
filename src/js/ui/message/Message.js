export default class Message {
    constructor(subMessages = []) {
        this.subMessages = subMessages;
        this.count = 1;
    }

    isEqual(subMessages) {
        if (this.subMessages.length !== subMessages.length) {
            return false;
        }

        for (let i = 0; i < this.subMessages.length; i++) {
            const sub1 = this.subMessages[i];
            const sub2 = subMessages[i];

            if (!sub1.isEqual(sub2)) {
                return false;
            }
        }

        return true;
    }

    getHtml() {
        const messageDom = document.createElement("div");
        messageDom.classList.add("message");

        for (const subMessage of this.subMessages) {
            const subMessageDom = document.createElement("span");
            subMessageDom.classList.add("message__text");

            if (subMessage.bold) {
                subMessageDom.classList.add("message__bold");
            }

            if (subMessage.italics) {
                subMessageDom.classList.add("message__italics");
            }
            subMessageDom.innerText = subMessage.text;
            subMessageDom.style.color = subMessage.color;
            messageDom.appendChild(subMessageDom);
        }

        if (this.count > 1) {
            messageDom.appendChild(this.getCountHtml());
        }

        return messageDom;
    }

    getCountHtml() {
        const amountDom = document.createElement("span");
        amountDom.classList.add("message__amount");
        amountDom.innerText = "x" + this.count;

        return amountDom;
    }
}