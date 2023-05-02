import { Context, PromptStore } from "../..";
import { publish } from "../../Managers/EventBus";
import { AskModelAction } from "./askModel";
import { LogDataAction } from "./logdata";

export class SummarizeAction {

    @Context.LangAction("Summarize Recent Data")
    public static async execute({after, context} : {after: string, context: Context.ContextWindow}) {

        const message = await PromptStore.get('message.util.summary', {guide: after});
        const result = await AskModelAction.execute({message, context});

        return {
            context: result.context,
            summary: result.context.lastMessage(),
            display: {
                summary: result.context.lastMessage()
            }
        }

    }

}