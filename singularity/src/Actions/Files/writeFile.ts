import { PromptStore } from "../..";
import { ActionType } from "../../Managers/ActionContext";
import { ChatContext } from "../../Managers/ChatContext";
import { RecordAction } from "../../Managers/Decorators";
import { writeFile } from "../../Managers/Files";
import { Action } from "../Action";
import askModel from "../Basic/askModel";
import readFile from "./readFile";
import understandFiles from "./understandFiles";

class WriteFile extends Action {

    @RecordAction(ActionType.Files, 'Write File')
    public static async invoke ({chat, file} : {chat: ChatContext, file: string}) {
        
        // Prompt model to read file
        const withReadFile = await readFile({chat, file})
        const writeFilePrompt = PromptStore.usePrompt('writefile.prompt', {path: file});
        const resultContext = withReadFile.resultContext
            .addMessages(writeFilePrompt)
            .named(`With prompt to write ${file}`);

        // Ask model for file name
        const responseData = await askModel({chat: resultContext});
        const toWrite = responseData.modelResponse;

        // Write file
        writeFile(file, toWrite)

        // Understand file, summarize, and add to knowledge
        await understandFiles.understandOne({chat: responseData.resultContext, file});

        // Write summary of actions to response context
        const responsePrompt = PromptStore.usePrompt('writefile.summary', {
            file: file,
            data: toWrite
        });
        const nextChat = chat
            .addMessages(responsePrompt, 'Acknowledged')
            .named(`With summary of writing ${file}`);

        return {
            resultContext: nextChat,
            summaryMessage: `Successfully Wrote File ${file} with data \n\`\`\`${toWrite}\`\`\``,
            writtenData: responseData.modelResponse
        }
    }
}

export default WriteFile.invoke;
