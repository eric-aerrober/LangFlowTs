import { PromptStore } from "../..";
import { ActionType } from "../../Managers/ActionContext";
import { ChatContext } from "../../Managers/ChatContext";
import { RecordAction } from "../../Managers/Decorators";
import { readFile } from "../../Managers/Files";
import { Action } from "../Action";

class ReadFile extends Action {

    @RecordAction(ActionType.Files, 'Read File')
    public static async invoke ({chat, file} : {chat: ChatContext, file: string}) {
        
        const data = await readFile(file);
        const readFilePrompt = PromptStore.usePrompt('readfile.prompt', {
            path: file,
            content: data
        })

        const resultContext = chat
            .addMessages(readFilePrompt, 'Acknowledged')
            .named(`Read ${file}`);

        return {
            resultContext: resultContext,
            contents: data
        }
    }
}

export default ReadFile.invoke;
