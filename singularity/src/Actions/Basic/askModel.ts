import { ActionContext, ActionType } from "../../Managers/ActionContext";
import { ChatContext } from "../../Managers/ChatContext";
import { RecordAction } from "../../Managers/Decorators";
import { Gpt4 } from "../../Models";
import { Action } from "../Action";

class AskModel extends Action {

    @RecordAction(ActionType.Model, 'Ask Model To Respond')
    public static async invoke ({chat} : {chat: ChatContext}) {
        
        // Query
        ActionContext.current.setLoading(true);
        const {value, cached} = await Gpt4.instance.askModel(chat)  
        const response = value.responseMessage;

        // Query Results to Context
        ActionContext.current.setLoading(false);
        ActionContext.current.addMetadata({modelQuery: value, cached: cached});

        // Add to chat
        const resultContext = chat
            .addMessages(response)
            .named('With Model Response');

        // Response
        return {
            resultContext: resultContext,
            modelResponse: response
        };

    }
}

export default AskModel.invoke;
