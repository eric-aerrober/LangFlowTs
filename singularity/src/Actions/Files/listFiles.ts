import { PromptStore } from "../..";
import { ActionType } from "../../Managers/ActionContext";
import { ChatContext } from "../../Managers/ChatContext";
import { RecordAction } from "../../Managers/Decorators";
import { listFiles } from "../../Managers/Files";
import { Action } from "../Action";
import { getWorkspaceKnowledge } from "./understandFiles";

class ListFiles extends Action {

    @RecordAction(ActionType.Files, 'List Files')
    public static async invoke ({chat} : {chat: ChatContext}) {
        
        const files = await listFiles();
        const workspaceKnowledge = await getWorkspaceKnowledge();
        const filesPrompt = PromptStore.usePrompt('listfiles.prompt', {
            files: workspaceKnowledge
        })

        const resultContext = chat
            .addMessages(filesPrompt, 'Acknowledged')
            .named('With Files');

        return {
            resultContext: resultContext,
            files: files
        }
    }
}

export default ListFiles.invoke;
