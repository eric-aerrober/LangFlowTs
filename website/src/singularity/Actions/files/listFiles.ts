import { Context, PromptStore } from "../..";
import { getWorkspace } from "../../Managers/Interface";

export class ListFilesAction {

    @Context.LangAction("List Workspace Files")
    public static async execute({context}: {context: Context.ContextWindow}) {

        const files = await getWorkspace();
        const prompt = await PromptStore.get('message.file.listdir', {content: files})

        return {
            context: context.addMessages([
                prompt,
                'Acknowledged'
            ]),
            summaryMsg: prompt
        }

    }

}