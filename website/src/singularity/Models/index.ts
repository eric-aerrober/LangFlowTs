import { ChatModel } from "./Model";
// import { ChatRequest, ChatResult } from "./Model.types";
import { Gpt4 } from "./models/Gpt4";

export interface ChatRequest {
    conversationRole: string,
    messages: ChatMessage[]
}

export interface ChatMessage {
    message: string,
    sender: string
}

export interface CachedRequestData {
    request: ChatRequest,
    result: ChatResult
}

export interface ChatResult {
    status: 'error' | 'success'
    errorMessage?: string
    tokenUsage?: number
    stopReason?: string
    responseMessage: string
}


export {
    ChatModel,
    Gpt4
}