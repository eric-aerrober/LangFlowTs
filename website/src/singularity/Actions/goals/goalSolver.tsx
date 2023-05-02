import { Actions, Context, PromptStore } from "../..";
import { getWorkspace, gitCommit } from "../../Managers/Interface";
import { SummarizeAction } from "../basic/summarize";

export class SolveGoalAction {

    @Context.LangAction("Solve Against Goal")
    public static async execute({goal, context}: {goal: string, context: Context.ContextWindow}) {

        const goalContext = await Actions.SetGoalAction.execute({goal, context})
        let useContext = goalContext.context

        let i = 0;

        for (;i < 10; i++ ) {

            const withFiles = await Actions.ListFilesAction.execute({context: useContext})
            const withAssessment = await Actions.GoalAssessmentAction.execute({goal, context: withFiles.context})

            if (withAssessment.obj.reachedGoal){
                break;
            }

            const afterUsingTool = await Actions.UseToolAction.execute({context: withAssessment.reflectContext})
            useContext = useContext.addMessages([
                afterUsingTool.summaryMsg,
                "Acknowledged",
            ])

        } 

        if (i < 10) {

            const summary = await SummarizeAction.execute({
                context: useContext,
                after: "Only summarize the most recent goal we worked towards. Do not recap everything in total."
            })

            const submit = await gitCommit(goal);

            return {
                context: useContext,
                summary: summary,
                display: {
                    reachedAfter: i,
                    summary: summary.summary
                }
            }

        }

        throw new Error("Goal not reached after 10 iterations")
    }
}