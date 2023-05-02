import { Context, PromptStore } from "../..";
import { getWorkspace, gitCommit, npmTest } from "../../Managers/Interface";
import { NpmTestAction } from "../bash/npmTest";
import { CommandModelAction } from "../basic/commandModel";
import { SummarizeAction } from "../basic/summarize";
import { ListFilesAction } from "../files/listFiles";
import { UseToolAction } from "../tools/useTool";
import { GoalAssessmentAction } from "./goalAssessment";
import { GoalAssessTesting } from "./goalTestingAssess";

export class FixTestingAction {

    @Context.LangAction("Testing Current Repo")
    public static async execute({context}: {context: Context.ContextWindow}) {

        // Tell it we want to do testing
        const prompt = await PromptStore.get('testing.begin')
        const withContext = await CommandModelAction.execute({message: prompt, context})

        let currentContext = withContext.context

        for (let i = 0; i < 10; i++) {

            // Run testing
            const withFiles = await ListFilesAction.execute({context: currentContext})
            const testResult = await NpmTestAction.execute({context: withFiles.context})

            // Goal assessment
            const withAssessment = await GoalAssessTesting.execute({context: testResult.context})

            // If we don't need to fix tests, we're done
            if (!withAssessment.obj.needToFixTests) {

                const summary = await SummarizeAction.execute({
                    context: withAssessment.context,
                    after: "Only summarize the most recent goal we worked towards. Do not recap everything in total."
                })

                const submit = await gitCommit('With testing');

                return {
                    ...testResult,
                    display: {
                        ...withAssessment.display,
                        message: "Testing passed"
                    },
                    summary: summary.summary,
                }
            }

            // Try to fix tests
            const afterUsingTool = await UseToolAction.execute({context: withAssessment.context})
            currentContext = currentContext.addMessages([
                afterUsingTool.summaryMsg,
                "Acknowledged",
            ])

        }

    }

}