import { Actions, Context, PromptStore } from "../..";
import { getWorkspace } from "../../Managers/Interface";
import { CommandModelAction } from "../basic/commandModel";
import { SummarizeAction } from "../basic/summarize";
import { FixTestingAction } from "./goalTesting";

export class SolveMultipleGoalAction {

    @Context.LangAction("Solve Against Goals")
    public static async execute({goals, context}: {goals: string[], context: Context.ContextWindow}) {

        const prompt = await PromptStore.get("message.goal.multi")
        const rootContext = await CommandModelAction.execute({ message: prompt, context})

        let baseContext = rootContext;

        for (const goal of goals) {

            // Solve action
            const solved = await Actions.SolveGoalAction.execute({goal, context: baseContext.context})

            // Test action
            const testAction = await FixTestingAction.execute({context: solved.context})

            // Summarize actions
            const withContextPrompt = await PromptStore.get("message.goal.summary", {step: goal, summary: solved.summary.summary})
            const withContext = await Actions.CommandModelAction.execute({message: withContextPrompt, context: baseContext.context})
            baseContext = withContext;
        
        }
        
    }
}