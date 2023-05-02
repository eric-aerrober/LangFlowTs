import { Context, PromptStore } from "../..";
import { getWorkspace, getWorkspaceFile, saveWorkspaceFile } from "../../Managers/Interface";

export class ReadFileAction {

    @Context.LangAction("Read Workspace File")
    public static async execute({file, context}: {file: string, context: Context.ContextWindow}) {

        const data = await getWorkspaceFile(file);
        const prompt = await PromptStore.get('message.file.content', {contents: data, path: file})

        return {
            context: context.addMessages([
                prompt,
                'Acknowledged'
            ]),
            summaryMsg: prompt
        }
    
    }

}
