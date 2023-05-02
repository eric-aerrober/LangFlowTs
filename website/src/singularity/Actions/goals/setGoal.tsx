import { Context, PromptStore } from "../..";
import { getWorkspace } from "../../Managers/Interface";

export class SetGoalAction {

    @Context.LangAction("Set Current Goal")
    public static async execute({goal, context}: {goal: string, context: Context.ContextWindow}) {

        const prompt = await PromptStore.get('message.goal.set', {goal})

        return {
            context: context.addMessages([
                prompt,
                'Acknowledged'
            ])  
        }

    }

}