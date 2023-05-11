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