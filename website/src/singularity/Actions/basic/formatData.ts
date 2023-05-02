import { Context, PromptStore } from "../..";
import { randomId, uuid } from "../../../utils/uuid";
import { ContextWindow } from "../../Managers/ContextManager";
import { publish } from "../../Managers/EventBus";
import { AskModelAction } from "./askModel";
import { CommandModelAction } from "./commandModel";
import { LogDataAction } from "./logdata";

export class FormatDataAction {

    @Context.LangAction("Format Response Data")
    public static async execute({format, context} : {format: string, context: Context.ContextWindow}) {

        const formatPrompt = await PromptStore.get('formatData.tryFormat', {format});
        const formatMessage = context.lastMessage();
        let formatContext = new ContextWindow(randomId(), 'Format Data', 'You format data into pure json responses', [
            formatMessage,
            "Acknowledged"
        ], true)

        let currentMessage = context.lastMessage();

        for (let i = 0; i < 3; i++) {

            let result = await AskModelAction.execute({message: formatPrompt, context: formatContext})
            formatContext = result.context;
            currentMessage = result.context.lastMessage();

            try {

                const asObject = JSON.parse(currentMessage);

                const result = {
                    obj: asObject,
                    context: context
                }

                await LogDataAction.execute({data: asObject, context})

                return result;

            } catch (e) {
                //@ts-ignore
                let commanded = await CommandModelAction.execute({message: e.message, context: formatContext})
                formatContext = commanded.context;
            }

        }


        throw new Error('Failed to format data')

    }

}