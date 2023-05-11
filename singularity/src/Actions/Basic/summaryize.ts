import { PromptStore } from "../..";
import { ActionType } from "../../Managers/ActionContext";
import { ChatContext } from "../../Managers/ChatContext";
import { EmptyAction, RecordAction, WithEmptyActionContext } from "../../Managers/Decorators";
import { Action } from "../Action";
import askModel from "./askModel";

class Summarize extends Action {

    @EmptyAction(ActionType.Format, 'Summarize Data', 'summarize.role')
    public static async invoke ({chat, data, context} : {chat: ChatContext, data: string, context?: string}) {
        
        const prompt = PromptStore.usePrompt('summarize.prompt', {data, context: context || ''});
        const withMessagesChain = chat
            .addMessages(prompt)
            .named('Summarize Request');

        const summary = await askModel({chat: withMessagesChain});

        return {
            resultContext: summary.resultContext,
            summary: summary.modelResponse
        }
    }
}

export default Summarize.invoke;
