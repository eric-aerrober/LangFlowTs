import { PromptStore } from "../..";
import { ActionContext, ActionType } from "../../Managers/ActionContext";
import { ChatContext } from "../../Managers/ChatContext";
import { EmptyAction, RecordAction, WithEmptyActionContext } from "../../Managers/Decorators";
import { Action } from "../Action";
import askModel from "./askModel";

class FormatData extends Action {

    @EmptyAction(ActionType.Format, 'Format As JSON', 'format.role')
    public static async invoke ({chat, data, format} : {chat: ChatContext, data: string, format: string}) {

        // Setup the chat
        const prompt = PromptStore.usePrompt('format.prompt', {format});
        chat = chat.addMessages(data, 'Acknowledged', prompt)

        // Try to get the data formatted tries
        for (let i = 0; i < 3; i++) {

            // Ask the model
            const {resultContext, modelResponse} = await askModel({ chat })
            chat = resultContext;

            // Try to parse the data
            try {
                const data = JSON.parse(modelResponse);
                ActionContext.current.addMetadata({format: data});
                return {
                    resultContext: chat,
                    parsedData: data
                }
            }
            catch (e: any) {
                chat = chat.addMessages(PromptStore.usePrompt('format.error', {error: e.message}))
            }
        }

        throw new Error('Failed to format data after 3 attempts');
    }

}

export default FormatData.invoke;
