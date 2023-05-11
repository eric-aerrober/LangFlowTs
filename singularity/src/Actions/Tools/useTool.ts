import { PromptStore } from "../..";
import { ActionContext, ActionType } from "../../Managers/ActionContext";
import { ChatContext } from "../../Managers/ChatContext";
import { RecordAction } from "../../Managers/Decorators";
import { Action } from "../Action";
import askModel from "../Basic/askModel";
import formatData from "../Basic/formatData";
import listFiles from "../Files/listFiles";
import writeFile from "../Files/writeFile";
import readFile from "../Files/readFile";
import npmInstall from "../Npm/npmInstall";
import npmTest from "../Npm/npmTest";

class UseTool extends Action {

    @RecordAction(ActionType.Tools, 'Use Tool')
    public static async invoke ({chat, popCount} : {chat: ChatContext, popCount ?: number}) {
        
        // Prompt model for tool
        const askModelPrompt = PromptStore.usePrompt('usetool.prompt');
        const askModelContext = chat
            .addMessages(askModelPrompt)
            .named('With prompt to use tool');

        // Choose a tool
        const toolChoice = await askModel({chat: askModelContext});

        // Format tool choice
        const toolChosen = await formatData({
            chat: toolChoice.resultContext, 
            data: toolChoice.modelResponse,
            format: '{"tools":[{"tool": "tool", params: "-a -b", ...otherArgs}]}'
        })

        // Add tool to metadata
        ActionContext.current.addMetadata({
            tools: toolChosen.parsedData
        })

        // Verify its valid
        const tools = toolChosen.parsedData.tools.map((t:any) => t.tool.toLowerCase());
        const anyInvalid = tools.some((t:string) => !['writefile', 'install', 'listworkspace', 'readfile', 'test'].includes(t));

        // If invalid, try again
        if (anyInvalid) {
            const errorMessage = PromptStore.usePrompt('usetoolunknown.prompt', {tool: JSON.stringify(toolChosen.parsedData, null, 2)})
            const errorContext = chat
                .addMessages(errorMessage, 'Acknowledged')
                .named('With invalid tool');
            const recurseContext: any = await UseTool.invoke({chat: errorContext, popCount: (popCount ? popCount + 2 : 2)});
            return {
                resultContext: recurseContext.resultContext,
            }
        }

        if (popCount) {
            chat = chat.popMessages(popCount);
        }

        // Use each tool, updating context for each
        let loopContext = chat;
        for (const tool of toolChosen.parsedData.tools) {
            const toolName = tool.tool;
            switch (toolName.toLowerCase()) {
                case 'writefile':
                    const response = await writeFile({chat: loopContext, file: tool.params});
                    loopContext = response.resultContext;
                    break;
                case 'listworkspace':
                    const response2 = await listFiles({chat: loopContext});
                    loopContext = response2.resultContext;
                    break;
                case 'readfile':
                    const response3 = await readFile({chat: loopContext, file: tool.params});
                    loopContext = response3.resultContext;
                    break;
                case 'install':
                    const installResponse = await npmInstall({chat: loopContext, params: tool.params});
                    loopContext = installResponse.resultContext;
                    break;
                case 'test':
                    const testResponse = await npmTest({chat: loopContext});
                    loopContext = testResponse.resultContext;
                    break;
                default:
                    throw new Error(`Tool ${toolName} not found??`);
            }
        }

        return {
            resultContext: loopContext
        }
    }
}

export default UseTool.invoke;
