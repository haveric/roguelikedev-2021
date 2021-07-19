import SubMessage from "./message/SubMessage";
import Message from "./message/Message";

class MessageConsole {
    constructor() {
        const self = this;
        this.messages = [];
        this.builder = [];

        this.consoleDom = document.createElement("div");
        this.consoleDom.classList.add("console");

        this.messagesDom = document.createElement("div");
        this.messagesDom.classList.add("messages");

        this.messagesInnerDom = document.createElement("div");
        this.messagesInnerDom.classList.add("messages__inn");
        this.messagesDom.appendChild(this.messagesInnerDom);
        this.consoleDom.appendChild(this.messagesDom);
    }

    text(text, color, options) {
        this.builder.push(new SubMessage(text, color, options));
        return this; // Allow chaining
    }

    build(stack = true) {
        this.addMessage(this.builder.slice(0), stack);
        this.builder = [];
    }

    addMessage(subMessages, stack = true) {
        if (stack && this.messages.length > 0) {
            const lastMessage = this.messages[this.messages.length - 1];
            if (lastMessage.isEqual(subMessages)) {
                lastMessage.count += 1;
                this.updateLastMessageCount(lastMessage);
            } else {
                this.messages.push(new Message(subMessages));
                this.addNewMessage();
            }
        } else {
            this.messages.push(new Message(subMessages));
            this.addNewMessage();
        }
    }

    updateLastMessageCount(lastMessage) {
        const lastMessageDom = document.querySelectorAll(".message:last-child")[0];
        const amountDom = lastMessageDom.querySelectorAll(".message__amount")[0];

        if (amountDom) {
            amountDom.innerText = "x" + lastMessage.count;
        } else {
            lastMessageDom.appendChild(lastMessage.getCountHtml());
        }
    }

    addNewMessage() {
        const lastMessage = this.messages[this.messages.length - 1];
        this.messagesInnerDom.appendChild(lastMessage.getHtml());
    }
}

const messageConsole = new MessageConsole();
export default messageConsole;