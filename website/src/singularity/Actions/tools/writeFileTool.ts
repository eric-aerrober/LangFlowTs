import { Context, PromptStore } from "../..";
import { getWorkspace, saveWorkspaceFile } from "../../Managers/Interface";
import { AskModelAction } from "../basic/askModel";
import { ReadFileAction } from "../files/readFile";
import { WriteFileAction } from "../files/writeFile";

export class WriteFileToolAction {

    @Context.LangAction("Use Tool: Write File")
    public static async execute({context}: {context: Context.ContextWindow}) {

        // Ask
        const prompt = await PromptStore.get('message.tool.chooseFile')
        const chosenFileContext = await AskModelAction.execute({message: prompt, context: context})
        const file = chosenFileContext.context.lastMessage();

        // Show current file
        const withCurrentFile = await ReadFileAction.execute({file, context: chosenFileContext.context});

        // Use Tool
        return await WriteFileAction.execute({file, context: withCurrentFile.context});

    }

}