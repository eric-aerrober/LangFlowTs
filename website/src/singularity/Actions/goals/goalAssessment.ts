import { Actions, Context, PromptStore } from "../..";

export class GoalAssessmentAction {

    @Context.LangAction("Goal Assessment")
    public static async execute({goal, context}: {goal: string, context: Context.ContextWindow}) {

        // Put the diff in chat
        const diff = await Actions.GitDiffAction.execute({context: context})

        // Have the goal assessed
        const prompt = await PromptStore.get('message.goal.assess', {goal})
        const withAssessed = await Actions.AskModelAction.execute({message: prompt, context: diff.context})

        // Then conform to object
        const result = await Actions.FormatDataAction.execute({format:'{reachedGoal: boolean}', context: withAssessed.context})

        return {
            ...result,
            display: result.obj,
            reflectContext: withAssessed.context,
        }

    }

}