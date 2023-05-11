import { PromptStore } from "../..";
import { ActionType } from "../../Managers/ActionContext";
import { ChatContext } from "../../Managers/ChatContext";
import { RecordAction } from "../../Managers/Decorators";
import { Action } from "../Action";
import askModel from "../Basic/askModel";
import formatData from "../Basic/formatData";
import useTool from "../Tools/useTool";
import think from "./think";

class EvaluateGoal extends Action {

    @RecordAction(ActionType.Goal, 'Evaluate Goal')
    public static async invoke ({chat} : {chat: ChatContext}) {
    
        // We ast the model to evaluate to the goal
        const askContext = chat
            .addMessages(
                PromptStore.usePrompt('goalAchieved.prompt'),
                'Acknowledged'
            )
            .named('With prompt to evaluate goal');

        // Take actions if needed
        const usedToolContext = await useTool({chat: askContext});

        // Ask model if we are done
        const withGoalAchievedPrompt = usedToolContext.resultContext
            .addMessages(PromptStore.usePrompt('isGoalAchieved.prompt'))
            .named('With prompt to ask if goal is achieved');
        const goalAchievedContext = await askModel({chat: withGoalAchievedPrompt});
        const formattedContext = await formatData({
            chat: goalAchievedContext.resultContext, 
            data: goalAchievedContext.modelResponse,
            format: '{goalIsAchieved: boolean, reasoning: string}'
        });

        const achieved = formattedContext.parsedData.goalIsAchieved
        const reasoning = formattedContext.parsedData.reasoning

        // Create a convinsing context
        const resultContext = chat
            .addMessages(
                PromptStore.usePrompt('goalAchievedSummary.prompt'),
                reasoning
            )

        // Setup

        return {
            resultContext: resultContext,
            achieved: achieved,
            reasoning: reasoning,
            summaryMessage: `Achieved: ${achieved}\n` + reasoning,
        }

    }
}

export default EvaluateGoal.invoke;
