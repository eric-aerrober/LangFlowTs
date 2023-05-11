/*
    Context is very important, it represents what is being passed into the model at any given time
*/

import { ChatRequest } from "../Models";
import { ActionContext } from "./ActionContext";
import { uuid } from "./Ids";

export class ChatContext {

    // A uuid for this context
    public id: string;
    public name: string;

    // The data needed for this context to be readable by a model
    private role: string;
    private messages: string[];

    // How it relates to other contexts
    private parentActionContextId: string;

    constructor (role: string, name: string, messages?: string[]) {
        this.id = uuid();
        this.role = role;
        this.name = name;
        this.messages = messages || [];
        this.parentActionContextId = ActionContext.current.id;
        ActionContext.current.addChildChatContext(this);
    }

    public toChatRequest(): ChatRequest {
        return {
            conversationRole: this.role,
            messages: this.messages.map((message, id) => ({
                message,
                sender: ['user', 'assistant'][id % 2]
            }))
        }
    }

    public addMessages(...messages: string[]) {
        return new ChatContext(this.role, this.name, [...this.messages, ...messages]);
    }

    public named(name: string) {
        this.name = name;
        return this;
    }

    public lastMessage() {
        return this.messages[this.messages.length - 1];
    }

    public popMessage() {
        return new ChatContext(this.role, this.name, this.messages.slice(0, this.messages.length - 1));
    }

    public popMessages(count: number) {
        return new ChatContext(this.role, this.name, this.messages.slice(0, this.messages.length - count));
    }
}
  