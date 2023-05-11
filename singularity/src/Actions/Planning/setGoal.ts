import { PromptStore } from "../..";
import { ActionType } from "../../Managers/ActionContext";
import { ChatContext } from "../../Managers/ChatContext";
import { RecordAction } from "../../Managers/Decorators";
import { Action } from "../Action";
import think from "./think";

class SetGoal extends Action {

    @RecordAction(ActionType.Goal, 'Set Goal')
    public static async invoke ({chat, goal} : {chat: ChatContext, goal: string}) {
    
        // Add to chat
        const prompt = PromptStore.usePrompt('setGoal.prompt', {goal})
        const resultContext = chat
            .addMessages(prompt, 'Acknowledged')
            .named('With Goal Set');

        // Think about it here for a second
        const withThoughts = await think({chat: resultContext});

        // Response
        return {
            resultContext: withThoughts.resultContext,
            summaryMessage: {
                goal: goal
            }
        };

    }
}

export default SetGoal.invoke;
