import { ChatContext } from "../Managers/ChatContext"

interface InvokeActionResponse {
    resultContext: ChatContext
}

export abstract class Action {
    public static invoke: (parameters: any) => Promise<InvokeActionResponse>;
}
