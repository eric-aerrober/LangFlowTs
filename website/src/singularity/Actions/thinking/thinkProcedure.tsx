import { Actions, Context, PromptStore } from "../..";
import { getWorkspace } from "../../Managers/Interface";

export class ThinkProcedureAction {

    @Context.LangAction("Thinking of a Procedure")
    public static async execute({text, context}: {text: string, context: Context.ContextWindow}) {

        const promptInitial = await PromptStore.get('think.steps', {start: text})
        const promptReflect = await PromptStore.get('think.steps.reflect', {})

        const initialContext = await Actions.AskModelAction.execute({
            message: promptInitial, context
        })

        const withReflectContext = await Actions.AskModelAction.execute({
            message: promptReflect, 
            context: initialContext.context
        })

        const generatedSteps = await Actions.FormatDataAction.execute({
            format: '{steps: string[]}',
            context: withReflectContext.context
        })
        
        return {
            context: generatedSteps.context,
            steps: generatedSteps.obj.steps as string[]
        }

    }

}