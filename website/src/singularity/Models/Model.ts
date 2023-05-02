import { ChatRequest, ChatResult } from ".";
import network from "../../state/network/network.class";
import { randomId, uuid } from "../../utils/uuid";
import { Cache, CacheConfig } from "../Managers/Cache";
import { ContextWindow } from "../Managers/ContextManager";
import { publish } from "../Managers/EventBus";

export interface ModelConfig {
    name: string,
    cacheConfig: CacheConfig
}

export class ChatModel {

    private name: string;
    private cache: Cache<ChatRequest, ChatResult>;

    constructor (config: ModelConfig){
        this.name = config.name;
        this.cache = new Cache<ChatRequest, ChatResult>(config.cacheConfig);
    }

    public async getContextResult (context?: ContextWindow){
        
        // Get the context
        context = context || ContextWindow.latestContext;
        const interactionId = uuid()

        // Record the event
        publish({
            eventType: 'get-context-prompt',
            message: `Getting context result for model ${this.name}`,
            object: {
                context, 
                model: this,
                interactionId,
            }
        })

        // Get the result
        const result = await this.getConversationResult(context.toChatRequest());

        const newWindow = context.addMessage(result.responseMessage);

        // Add the result to the context
        network.addCall(result.tokenUsage)
        publish({
            eventType: 'get-context-result',
            message: `Getting context result for model ${this.name}`,
            object: {
                context: newWindow, 
                model: this,
                interactionId,
                tokens: result.tokenUsage,
                display: { 
                    tokens: result.tokenUsage,
                    cost: `\$${Math.round((result.tokenUsage/10) * 0.04)/100}`
                }
            }
        })

        return newWindow;
    }

    public async getConversationResult (chat: ChatRequest){
        return await this.cache.resolve(chat, async () => {
            return await this.invokeInternal(chat);
        })
    }

    protected async invokeInternal (chat: ChatRequest): Promise<ChatResult>{ 
        throw new Error('Not implemented');
    }

}