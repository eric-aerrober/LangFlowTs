import { Context, PromptStore } from "../..";
import { getWorkspace, getWorkspaceFile, gitDiff, npmTest, saveWorkspaceFile } from "../../Managers/Interface";
import { AskModelAction } from "../basic/askModel";

export class GitDiffAction {

    @Context.LangAction("Git Diff")
    public static async execute({context}: {context: Context.ContextWindow}) {

        const data = await gitDiff();
        const prompt = await PromptStore.get('git.diff', {diff: data})

        return {
            context: context.addMessages([
                prompt,
                'Acknowledged'
            ])
        }
    
    }

}