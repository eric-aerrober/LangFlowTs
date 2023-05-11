import { ChatRequest, ChatResult } from ".";
import { Cache } from "../Managers/Cache";
import { ChatContext } from "../Managers/ChatContext";

export class ChatModel {

    private cache: Cache<ChatRequest, ChatResult>  = new Cache<ChatRequest, ChatResult>();

    public async askModel (context: ChatContext){
        return await this.askModelWithCache(context.toChatRequest());
    }

    private async askModelWithCache (chat: ChatRequest){
        return await this.cache.resolve(chat, async () => {
            return await this.invokeInternal(chat);
        })
    }

    protected async invokeInternal (chat: ChatRequest): Promise<ChatResult>{ 
        throw new Error('Not implemented');
    }

}