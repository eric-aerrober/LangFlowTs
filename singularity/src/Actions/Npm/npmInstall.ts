import { PromptStore } from "../..";
import { ActionType } from "../../Managers/ActionContext";
import { runBash } from "../../Managers/Bash";
import { ChatContext } from "../../Managers/ChatContext";
import { RecordAction } from "../../Managers/Decorators";
import { getWorkspace } from "../../Managers/Files";
import { Action } from "../Action";

class NpmInstall extends Action {

    @RecordAction(ActionType.Tools, 'Installing Packages')
    public static async invoke ({chat, params} : {chat: ChatContext, params: string}) {

        // Run
        const command = `npm install ${params}`;
        const workspace = getWorkspace()
        const scopedCommand = `cd ${workspace} && ${command}`;
        const response = await runBash(scopedCommand, true);

        // Add to chat
        const message = PromptStore.usePrompt('withbash.prompt', {command, output: response})
        const resultContext = chat
            .addMessages(message, 'Acknowledged')
            .named('With Install Response');

        // Response
        return {
            resultContext: resultContext,
            command,
            response
        };

    }
}

export default NpmInstall.invoke;
