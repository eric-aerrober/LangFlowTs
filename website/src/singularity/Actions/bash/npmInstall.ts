import { Context, PromptStore } from "../..";
import { getWorkspace, getWorkspaceFile, npmInstall, npmTest, saveWorkspaceFile } from "../../Managers/Interface";
import { AskModelAction } from "../basic/askModel";

export class NpmInstallAction {

    @Context.LangAction("Run Npm Install")
    public static async execute({params, context}: {params: string, context: Context.ContextWindow}) {

        const data = await npmInstall(params);

        // last 40 lines
        const lines = data.split('\n');
        const lastLines = lines.slice(Math.max(lines.length - 40, 0)).join('\n');

        const prompt = await PromptStore.get('npm.install.content', {params: params, contents: lastLines})

        return {
            context: context.addMessages([
                prompt,
                'Acknowledged'
            ]),
            summaryMsg: prompt
        }
    
    }

}