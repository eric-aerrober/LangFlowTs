import { Context, PromptStore } from "../..";
import { publish } from "../../Managers/EventBus";

export class LogDataAction {

    public static async execute({data, context} : {data: string, context: Context.ContextWindow}) {
        publish({
            eventType: 'log',
            object: {data, context}
        })
    }

}