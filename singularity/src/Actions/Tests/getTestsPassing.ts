import { PromptStore } from "../..";
import { ActionType } from "../../Managers/ActionContext";
import { ChatContext } from "../../Managers/ChatContext";
import { RecordAction } from "../../Managers/Decorators";
import { Action } from "../Action";
import askModel from "../Basic/askModel";
import formatData from "../Basic/formatData";
import npmTest from "../Npm/npmTest";
import think from "../Planning/think";
import useTool from "../Tools/useTool";

class GetTestsPassing extends Action {

    @RecordAction(ActionType.Testing, 'Get Tests Passing')
    public static async invoke ({chat} : {chat: ChatContext}) {
    
        // Get tests passing
        const prompt = PromptStore.usePrompt('getTestsPassing.prompt')
        const resultContext = chat
            .addMessages(prompt, 'Acknowledged')
            .named('With Testing Prompt');

        // Run tests
        const withTestsRun = await npmTest({chat: resultContext});
        const withThoughts = await think({chat: withTestsRun.resultContext});

        // Loop to get tests passing
        let loopContext = withThoughts.resultContext;
        for (let i = 0; i < 10; i++) {
            const withTools = await useTool({chat: loopContext});
            const testResult = await npmTest({chat: withTools.resultContext});

            // Check tests
            const checkTests = await askModel({
                chat: testResult.resultContext
                    .addMessages(PromptStore.usePrompt('areTestsPassing.prompt'))
                    .named('With Testing Prompt')
            })
            const checkTestsResultFormat = await formatData({
                chat: checkTests.resultContext,
                data: checkTests.resultContext.lastMessage(),
                format: "{repoInValidState: boolean}"
            })

            if (checkTestsResultFormat.parsedData.repoInValidState) {
                break;
            }

            const withThoughts = await think({chat: testResult.resultContext});
            loopContext = withThoughts.resultContext;
        }

        // Response
        return {
            resultContext: loopContext
        };

    }
}

export default GetTestsPassing.invoke;
