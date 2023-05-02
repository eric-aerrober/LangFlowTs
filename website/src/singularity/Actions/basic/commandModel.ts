import { Context } from "../..";
import { Gpt4 } from "../../Models";

export class CommandModelAction {

    @Context.LangAction("Command Model")
    public static async execute({message, context} : {message: string, context: Context.ContextWindow}) {

        // Add the message to the context
        return {
            context: context.addMessages([
                message,
                'Acknowledged'
            ])
        }
    }

}