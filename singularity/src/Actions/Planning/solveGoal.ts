import { ActionType } from "../../Managers/ActionContext";
import { ChatContext } from "../../Managers/ChatContext";
import { RecordAction } from "../../Managers/Decorators";
import { Action } from "../Action";
import useTool from "../Tools/useTool";
import evaluateGoal from "./evaluateGoal";
import setGoal from "./setGoal";

class SolveGoal extends Action {

    @RecordAction(ActionType.Goal, 'Solve Goal')
    public static async invoke ({goal, chat} : {chat: ChatContext, goal: string}) {
        
        // Set goal
        const setGoalContext = await setGoal({chat, goal});

        // Act
        let runningContext = setGoalContext.resultContext;
        for (let i = 0; i < 10; i++){
            
            const consideration = await evaluateGoal({chat: runningContext});

            if (consideration.achieved) {
                break;
            }

            const toolUse = await useTool({chat: consideration.resultContext});
            runningContext = toolUse.resultContext;

        }

        return {
            resultContext: runningContext
        }
    }
}

export default SolveGoal.invoke;
