import html from '../../html/ui/MessageConsole.html';
import SubMessage from "./message/SubMessage";
import Message from "./message/Message";
import UIElement from "./UIElement";

class MessageConsole extends UIElement {
    constructor() {
        super(html);
        this.messages = [];
        this.builder = [];

        const consoleIncreaseDom = this.dom.getElementsByClassName("console__increase")[0];
        consoleIncreaseDom.addEventListener("click", function(e) {
            const parent = e.target.parentElement;
            if (!parent.classList.contains("animate")) {
                parent.classList.add("animate");
            }
            if (parent.classList.contains("collapsed")) {
                parent.classList.remove("collapsed");
            } else {
                parent.classList.add("full");
            }
        });

        const consoleDecreaseDom = this.dom.getElementsByClassName("console__decrease")[0];
        consoleDecreaseDom.addEventListener("click", function(e) {
            const parent = e.target.parentElement;
            if (!parent.classList.contains("animate")) {
                parent.classList.add("animate");
            }
            if (parent.classList.contains("full")) {
                parent.classList.remove("full");
            } else {
                parent.classList.add("collapsed");
            }
        });

        this.messagesInnerDom = this.dom.getElementsByClassName("messages__inn")[0];
    }

    text(text, color, options) {
        this.builder.push(new SubMessage(text, color, options));
        return this; // Allow chaining
    }

    build(stack = true) {
        this.addMessage(this.builder.slice(0), stack);
        this.builder = [];
    }

    clear() {
        this.messagesInnerDom.innerHTML = "";
        this.messages = [];
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

    close() {
        super.close();

        this.dom.classList.remove("animate");
    }
}

const messageConsole = new MessageConsole();
export default messageConsole;