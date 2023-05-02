import { Context, PromptStore } from "../..";
import { getWorkspace, saveWorkspaceFile } from "../../Managers/Interface";
import { AskModelAction } from "../basic/askModel";
import { ReadFileAction } from "../files/readFile";
import { WriteFileAction } from "../files/writeFile";

export class ReadFileToolAction {

    @Context.LangAction("Use Tool: Read File")
    public static async execute({context}: {context: Context.ContextWindow}) {

        // Ask
        const prompt = await PromptStore.get('message.tool.chooseFile')
        const chosenFileContext = await AskModelAction.execute({message: prompt, context: context})
        const file = chosenFileContext.context.lastMessage();

        // Use Tool
        return await ReadFileAction.execute({file, context: chosenFileContext.context});

    }

}