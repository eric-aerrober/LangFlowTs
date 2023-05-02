import { Context, PromptStore } from "../..";
import { getWorkspace, saveWorkspaceFile } from "../../Managers/Interface";
import { AskModelAction } from "../basic/askModel";

export class WriteFileAction {

    @Context.LangAction("Write Workspace File")
    public static async execute({file, context}: {file: string, context: Context.ContextWindow}) {

        // Ask
        const prompt = await PromptStore.get('message.file.write', {path: file})
        const fileDataContext = await AskModelAction.execute({message: prompt, context: context})

        // Write
        let data = fileDataContext.context.lastMessage();
        if (data.startsWith('```')){
            data = data.replace(/```[^\s]*/g, '')
            data = data.replace(/```/g, '')
        }
        await saveWorkspaceFile(file, fileDataContext.context.lastMessage())

        // Confirm
        const confirmPrompt = await PromptStore.get('message.file.write.confirm', {path: file, data})
        return {
            context: fileDataContext.context.addMessages([
                confirmPrompt, 
                'Acknowledged'
            ]),
            summaryMsg: confirmPrompt
        }

    }

}