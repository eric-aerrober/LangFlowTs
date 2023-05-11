import { ChatCompletionRequestMessageRoleEnum, Configuration, CreateCompletionResponse, OpenAIApi } from "openai";
import { ChatModel } from "../Model";
import { ChatRequest, ChatResult } from "..";

export class Gpt4 extends ChatModel {

    private openai: OpenAIApi
    public static instance: Gpt4;

    constructor (config: { apiKey: string }){
        super();
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
            result = await new Promise((resolve, reject) => {
                const chatRequest = {
                    model: 'gpt-4',
                    messages: [
                        {
                            role: ChatCompletionRequestMessageRoleEnum.System,
                            content: chat.conversationRole
                        },
                        ...chat.messages.map(m => ({
                            role: m.sender as ChatCompletionRequestMessageRoleEnum,
                            content: m.message
                        }))
                    ],
                    max_tokens: 500,
                }
                this.openai.createChatCompletion(chatRequest)
                .then((result:any) => {
                    stopReason = result.data.choices[0].finish_reason as string;
                    resolve(result.data);
                })
                .catch((err:any) => {
                    errorMessage = err.response.data.error.message as string;
                    status = 'error';
                    console.log(err.response.data.error)
                    console.log("FAILED REQUEST ITSELF")
                    reject(err);
                })
            })
        }
        catch (err) {
            //@ts-ignore
            console.log(err.response.data)
            console.log("DID ERROR")
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