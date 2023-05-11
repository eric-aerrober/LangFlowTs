/*
    Wrap a function in an ActionContext, which will be recorded to our visualizer.
*/

import { ActionContext } from "./ActionContext";
import { ChatContext } from "./ChatContext";
import { RecordActionContext } from "./Logger";
import { usePrompt } from "./PromptStore";

export function RecordAction(type: string, name: string){
    return function (target: any, propertyKey: string, descriptor: any) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (params: any) {
            
            // We build a new action context here
            const previousActionContext = ActionContext.current;
            const newActionContext = new ActionContext({
                name, type, chatContext: params.chat, metadata: {}, parentActionContextId: previousActionContext.id
            })

            // We swap it out
            previousActionContext.addChild(newActionContext);
            ActionContext.current = newActionContext;

            // We record it
            RecordActionContext(previousActionContext);
            RecordActionContext(newActionContext);

            // We run the original method
            const result = await originalMethod(params)

            // Record the result
            const {resultContext, ...rest} = result;
            newActionContext.addMetadata({result: rest});

            // We swap it back
            ActionContext.current = previousActionContext;

            // We record it
            RecordActionContext(previousActionContext);
            RecordActionContext(newActionContext);

            return result;
        };
        return descriptor;
    }
}
  

export function EmptyAction(type: string, name: string, role: string){
    return function (target: any, propertyKey: string, descriptor: any) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (params: any) {
            const rolePrompt = usePrompt(role);
            return await WithEmptyActionContext({
                name, type, role: rolePrompt,
                run: async (chat: ChatContext) => {
                    return await originalMethod({...params, chat})
                }
            })
        };
        return descriptor;
    }
}
  


interface WithEmptyActionContextConfig<T> {
    name: string;
    type: string;
    role: string;
    run: (chat: ChatContext) => T;
}

export async function WithEmptyActionContext<T>({name, type, role, run}: WithEmptyActionContextConfig<T>) {

    const newActionContext = ActionContext.current
        .spawnEmptyChild({
            name: name,
            type: type,
            role: role
        });
    const previousActionContext = ActionContext.current;

    // We swap it out
    previousActionContext.addChild(newActionContext);
    ActionContext.current = newActionContext;

    // We record it
    RecordActionContext(previousActionContext);
    RecordActionContext(newActionContext);

    // We run the original method
    const result = await run(newActionContext.getChatContext());

    // We swap it back
    ActionContext.current = previousActionContext;

    // We record it
    RecordActionContext(previousActionContext);
    RecordActionContext(newActionContext);

    return result;

}