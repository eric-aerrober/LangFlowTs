import { Context, PromptStore } from "../..";
import { getWorkspace, getWorkspaceFile, npmTest, saveWorkspaceFile } from "../../Managers/Interface";
import { AskModelAction } from "../basic/askModel";

export class NpmTestAction {

    @Context.LangAction("Run Testing")
    public static async execute({context}: {context: Context.ContextWindow}) {

        const data = await npmTest();
        const prompt = await PromptStore.get('testing.run.content', {contents: data})

        return {
            context: context.addMessages([
                prompt,
                'Acknowledged'
            ]),
            summaryMsg: prompt
        }
    
    }

}