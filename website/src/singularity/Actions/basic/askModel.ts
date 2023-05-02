import { Context } from "../..";
import { Gpt4 } from "../../Models";

export class AskModelAction {

    @Context.LangAction("Ask Model Question")
    public static async execute({message, context} : {message: string, context: Context.ContextWindow}) {

        // Add the message to the context
        const withMessage = context.addMessage(message)

        // Get the result from the model
        const newContext = await Gpt4.instance.getContextResult(withMessage);

        return {
            context: newContext
        }
    }

}