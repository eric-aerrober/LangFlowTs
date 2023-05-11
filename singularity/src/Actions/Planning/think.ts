import { PromptStore } from "../..";
import { ActionType } from "../../Managers/ActionContext";
import { ChatContext } from "../../Managers/ChatContext";
import { RecordAction } from "../../Managers/Decorators";
import { Action } from "../Action";
import askModel from "../Basic/askModel";

class Think extends Action {

    @RecordAction(ActionType.Goal, 'Thinking about that')
    public static async invoke ({chat} : {chat: ChatContext}) {
    
        // Ask model
        const prompt = PromptStore.usePrompt('thinkaboutthat.prompt');
        const questionContext = chat
            .addMessages(prompt)
            .named('Thinking about that');

        // Get response
        const {modelResponse} = await askModel({chat: questionContext})

        // Create result context
        const resultContext = chat
            .popMessage()
            .addMessages("Acknowledged\n\n" + modelResponse)
            .named('With model thinking');

        // Response
        return {
            resultContext: resultContext,
            summaryMessage: modelResponse
        };
    }
}

export default Think.invoke;
