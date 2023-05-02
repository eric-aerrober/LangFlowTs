import { ChatCompletionRequestMessageRoleEnum, Configuration, CreateCompletionResponse, OpenAIApi } from "openai";
import { ChatModel, ModelConfig } from "../Model";
import { ChatRequest, ChatResult } from "..";

interface Gpt4Config extends ModelConfig {
    apiKey: string
}

let kill = false;
export const killGpt4 = () => kill = true;

export class Gpt4 extends ChatModel {

    private openai: OpenAIApi
    public static instance: Gpt4;

    constructor (config: Gpt4Config){
        super(config);
        this.openai = new OpenAIApi( new Configuration({ apiKey: config.apiKey }));
        Gpt4.instance = this;
    }

    protected async invokeInternal (chat: ChatRequest): Promise<ChatResult>{ 
        
        let stopReason = '';
        let errorMessage = '';
        let status: 'error' | 'success' = 'success';
        let responseMessage = '';
        let tokenUsage = 0;

        let result: CreateCompletionResponse = null as any;
        
        try {
            if (kill) {
                throw new Error('Killed');
            }
            result = await new Promise((resolve, reject) => {
                this.openai.createChatCompletion({
                    model: 'gpt-4',
                    messages: [
                        {
                            role: 'system',
                            content: chat.conversationRole
                        },
                        ...chat.messages.map(m => ({
                            role: m.sender as ChatCompletionRequestMessageRoleEnum,
                            content: m.message
                        }))
                    ],
                    max_tokens: 500,
                })
                .then((result) => {
                    stopReason = result.data.choices[0].finish_reason as string;
                    resolve(result.data);
                })
                .catch((err) => {
                    errorMessage = err.response.data.error.message as string;
                    status = 'error';
                    reject(err);
                })
            })
        }
        catch (err) {
            console.log(err)
            status = 'error';
        }

        const choice = result.choices[0]
        if (!choice) {
            errorMessage = 'OpenAI returned no response!';
            status = 'error';
        }

        //@ts-ignore
        responseMessage = choice.message.content
        tokenUsage = result.usage?.total_tokens as number;

        return {
            status,
            errorMessage,
            tokenUsage,
            stopReason,
            responseMessage
        }
    }


}