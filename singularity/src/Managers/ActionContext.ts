/*
    Action context encapsulates an action that we record to our visualizer.
    Actions have chat contexts and any other metadata we need to record.
*/

import { ChatContext } from "./ChatContext";
import { uuid } from "./Ids";
import { RecordActionContext } from "./Logger";

interface ActionContextConfig {
    name: string;
    type: string;
    chatContext: ChatContext;
    metadata: any;
    parentActionContextId: string;
}

export enum ActionType {
    Model = 'model',
    Format = 'format',
    Files = 'files',
    Tools = 'tool',
    Goal = 'goal',
    Testing = 'testing',
}

interface Timeline {
    time: number;
    id: string;
}

export class ActionContext {

    public static current : ActionContext = new ActionContext({
        name: 'root',
        type: 'root',
        chatContext: undefined as any,
        metadata: {},
        parentActionContextId: ''
    })

    public id: string;
    public name: string;
    public type: string;
    private metadata: any;
    private childrenActionContextIds: string[] = []
    private chatContexts: ChatContext[] = [];
    private timeline: Timeline[] = [];
    private parentActionContextId: string | undefined;
    private loading: boolean = false;

    constructor (config: ActionContextConfig) {
        this.id = uuid();
        this.name = config.name;
        this.type = config.type;
        this.chatContexts = [config.chatContext];
        this.metadata = config.metadata;
        this.parentActionContextId = config.parentActionContextId;
        this.timeline = [{
            time: Date.now(),
            id: this.id
        }]
    }

    public addMetadata (data: any) {
        this.metadata = {
            ...this.metadata,
            ...data
        }
        RecordActionContext(this)
    }

    public setLoading (loading: boolean) {
        this.loading = loading;
        RecordActionContext(this)
    }

    public addChildChatContext (chatContext: ChatContext) {
        this.chatContexts.push(chatContext);
        this.timeline.push({
            time: Date.now(),
            id: chatContext.id
        })
    }

    public getMetadata () {
        return this.metadata;
    }

    public addChild (child: ActionContext) {
        this.childrenActionContextIds.push(child.id);
        this.timeline.push({
            time: Date.now(),
            id: child.id
        })
    }

    public spawnEmptyChild ({name, type, role}: {name: string, type: string, role: string}) {
        const child = new ActionContext({
            name,
            type,
            chatContext: new ChatContext(role, name),
            metadata: {},
            parentActionContextId: this.id
        })
        return child;
    }

    public addEvent (event: string) {
        this.timeline.push({
            time: Date.now(),
            id: event
        })
    }

    public getChatContext () {
        return this.chatContexts[this.chatContexts.length - 1];
    }

}
