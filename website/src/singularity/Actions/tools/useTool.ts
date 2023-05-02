import { Context, PromptStore } from "../..";
import { NpmInstallAction } from "../bash/npmInstall";
import { NpmTestAction } from "../bash/npmTest";
import { AskModelAction } from "../basic/askModel";
import { CommandModelAction } from "../basic/commandModel";
import { FormatDataAction } from "../basic/formatData";
import { ListFilesAction } from "../files/listFiles";
import { ReadFileToolAction } from "./readFileTool";
import { WriteFileToolAction } from "./writeFileTool";

export class UseToolAction {

    @Context.LangAction("Use Tool")
    public static async execute({context}: {context: Context.ContextWindow}): Promise<{ context: Context.ContextWindow, display: any, summaryMsg: string }> {

        // Ask
        const prompt = await PromptStore.get('message.tool.list')
        const toolChosenContext = await AskModelAction.execute({message: prompt, context: context})
        const toolFormatted = await FormatDataAction.execute({format: "{command: string}", context: toolChosenContext.context});
        const toolChosen = toolFormatted.obj.command;
        const toolName = toolChosen.split(' ')[0];
        const params = toolChosen.split(' ').slice(1).join(' ');

        switch (toolName) {
            
            case "READFILE":
                let data1 = await ReadFileToolAction.execute({context: toolChosenContext.context});
                return { ...data1, display: { tool: toolChosen }}
            
            case "WRITEFILE":
                let data2 = await WriteFileToolAction.execute({context: toolChosenContext.context});
                return { ...data2, display: { tool: toolChosen }}
            
            case "LISTDIR":
                let data3 = await ListFilesAction.execute({context: toolChosenContext.context});
                return { ...data3, display: { tool: toolChosen }}

            case "INSTALL":
                let data4 = await NpmInstallAction.execute({params, context: toolChosenContext.context});
                return { ...data4, display: { tool: toolChosen }}

            case "TEST":
                let data5 = await NpmTestAction.execute({context: toolChosenContext.context});
                return { ...data5, display: { tool: toolChosen }}

            default:
                const invalid = await PromptStore.get('message.tool.invalid')
                const invalidResult = await CommandModelAction.execute({message: invalid, context: toolChosenContext.context});
                return await UseToolAction.execute({context: invalidResult.context});
        }
    }

}