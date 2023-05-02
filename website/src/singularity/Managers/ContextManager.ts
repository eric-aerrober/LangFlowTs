/*
    Context is very important, this function manages who has control of the context and what is in the context
*/

import { uuid } from "../../utils/uuid";
import { ChatRequest } from "../Models";
import { publish } from "./EventBus";

// Ids
let id = 10;
let nextId = () => id++;

// Relationships
// Which context is a child of which context
let relationships: Map<number, number[]> = new Map<number, number[]>();

// Contexts are like so
export class ContextWindow {

    public static latestContext: ContextWindow;

    id: number;
    role: string;
    name: string;
    messages: string[];

    constructor (id: number, name: string, role: string, messages: string[], newContext?: boolean) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.messages = messages;
        ContextWindow.latestContext = this;
        if (newContext){
            publish({
                eventType: 'context-created',
                message: `Created context ${this.id}`,
                object: {
                    context: this
                }
            })
        }
        else {
            publish({
                eventType: 'context-updated',
                message: `updated context ${this.id}`,
                object: {
                    context: this
                }
            })
        }
    }

    public childContext(name: string) {
        let newContext = new ContextWindow(nextId(), name, this.role, this.messages, true);
        let children = relationships.get(this.id) || [];
        children.push(newContext.id);
        relationships.set(this.id, children);
        publish({
            eventType: 'child-context-created',
            message: `Created child context ${newContext.id} for context ${this.id}`,
            object: {
                parent: this,
                child: newContext
            }
        })
        return newContext;
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

    public addMessage(message: string) {
        return new ContextWindow(nextId(), this.name, this.role, [...this.messages, message]);
    }

    public addMessages(messages: string[]) {
        return new ContextWindow(nextId(), this.name, this.role, [...this.messages, ...messages]);
    }

    public lastMessage() {
        return this.messages[this.messages.length - 1];
    }
}

// Decorators
export function LangAction(name: string){
    return function (target: any, propertyKey: string, descriptor: any) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (params: any) {
            let id = uuid();
            publish({
                eventType: 'begin-action',
                message: `Beginning action ${name} in context ${params.context.id}`,
                object: {
                    name,
                    context: params.context,
                    id,
                }
            })
            const result = await originalMethod(params)
            publish({
                eventType: 'end-action',
                message: `Ending action ${name} in context ${params.context.id}`,
                object: {
                    name,
                    id,
                    ...result
                }
            })
            return result;
        };
        return descriptor;
    }
}
  