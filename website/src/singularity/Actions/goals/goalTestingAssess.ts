import { Actions, Context, PromptStore } from "../..";

export class GoalAssessTesting {

    @Context.LangAction("Testing Assessment")
    public static async execute({context}: {context: Context.ContextWindow}) {

        // Have the testing assessed
        const prompt = await PromptStore.get('testing.valid')
        const withAssessed = await Actions.AskModelAction.execute({message: prompt, context: context})

        // Then conform to object
        const result = await Actions.FormatDataAction.execute({format:'{needToFixTests: boolean}', context: withAssessed.context})

        return {
            ...result,
            display: result.obj
        }

    }

}