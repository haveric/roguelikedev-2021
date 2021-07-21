import SubMessage from "./message/SubMessage";
import Message from "./message/Message";

class MessageConsole {
    constructor() {
        this.messages = [];
        this.builder = [];

        this.consoleDom = document.createElement("div");
        this.consoleDom.classList.add("console");

        this.consoleIncreaseDom = document.createElement("button");
        this.consoleIncreaseDom.classList.add("console__increase");
        this.consoleIncreaseDom.classList.add("console__button");
        this.consoleIncreaseDom.innerText = "▲";
        this.consoleIncreaseDom.addEventListener("click", function(e) {
            const parent = e.target.parentElement;
            if (parent.classList.contains("collapsed")) {
                parent.classList.remove("collapsed");
            } else {
                parent.classList.add("full");
            }
        });

        this.consoleDecreaseDom = document.createElement("button");
        this.consoleDecreaseDom.classList.add("console__decrease");
        this.consoleDecreaseDom.classList.add("console__button");
        this.consoleDecreaseDom.innerText = "▼";
        this.consoleDecreaseDom.addEventListener("click", function(e) {
            const parent = e.target.parentElement;
            if (parent.classList.contains("full")) {
                parent.classList.remove("full");
            } else {
                parent.classList.add("collapsed");
            }
        });

        this.messagesWrapDom = document.createElement("div");
        this.messagesWrapDom.classList.add("messages__wrap");

        this.messagesDom = document.createElement("div");
        this.messagesDom.classList.add("messages");

        this.messagesInnerDom = document.createElement("div");
        this.messagesInnerDom.classList.add("messages__inn");
        this.messagesDom.appendChild(this.messagesInnerDom);
        this.messagesWrapDom.appendChild(this.messagesDom);
        this.consoleDom.appendChild(this.messagesWrapDom);
        this.consoleDom.appendChild(this.consoleIncreaseDom);
        this.consoleDom.appendChild(this.consoleDecreaseDom);
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