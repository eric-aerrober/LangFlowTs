import { PromptStore } from "../..";
import { ActionType } from "../../Managers/ActionContext";
import { ChatContext } from "../../Managers/ChatContext";
import { RecordAction } from "../../Managers/Decorators";
import { Action } from "../Action";
import askModel from "../Basic/askModel";
import formatData from "../Basic/formatData";
import listFiles from "./listFiles";

class ChooseFiles extends Action {

    @RecordAction(ActionType.Files, 'Choose Files')
    public static async invoke ({chat, count, consideration} : {chat: ChatContext, count: number, consideration: string}) {
        
        const withListedFiles = await listFiles({chat});
        const prompt = PromptStore.usePrompt('choosefiles.prompt', {
            fileCount: count == 1 ? 'one file' : `${count} files`,
            consideration,
        })

        const withPromptContext = withListedFiles.resultContext
            .addMessages(prompt)
            .named('Asking to choose file(s)');

        const response = await askModel({chat : withPromptContext});

        const resultFormatted = await formatData({
            chat: response.resultContext, 
            data: response.modelResponse,
            format: '{files: string[]}'
        });

        return {
            resultContext: response.resultContext,
            summaryMessage: "Successfully Chose Files",
            chosenFiles: resultFormatted.parsedData.files
        }

    }
}

export default ChooseFiles.invoke;
