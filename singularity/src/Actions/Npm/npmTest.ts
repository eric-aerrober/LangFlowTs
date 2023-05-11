import { PromptStore } from "../..";
import { ActionType } from "../../Managers/ActionContext";
import { runBash } from "../../Managers/Bash";
import { ChatContext } from "../../Managers/ChatContext";
import { RecordAction } from "../../Managers/Decorators";
import { getWorkspace } from "../../Managers/Files";
import { Action } from "../Action";

class NpmTest extends Action {

    @RecordAction(ActionType.Tools, 'Running Tests')
    public static async invoke ({chat} : {chat: ChatContext}) {

        // Run
        const command = `npm run test`;
        const workspace = getWorkspace()
        const scopedCommand = `cd ${workspace} && ${command}`;
        let response = await runBash(scopedCommand, true);

        // Add to chat
        const message = PromptStore.usePrompt('withbash.prompt', {command, output: response})
        const resultContext = chat
            .addMessages(message, 'Acknowledged')
            .named('With Test Results');

        // Response
        return {
            resultContext: resultContext,
            command,
            response
        };

    }
}

export default NpmTest.invoke;
