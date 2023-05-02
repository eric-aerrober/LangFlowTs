import { Actions, Context, PromptStore } from "../singularity"
import { resetWorkspace } from "../singularity/Managers/Interface";
import network from "../state/network/network.class";

export async function testWorkflow () {

    // Setup
    network.clear();
    await resetWorkspace();

    // Run
    const rootRole = await PromptStore.get('role-developer');
    const rootContext = new Context.ContextWindow(1, 'Developer Role Context', rootRole, [], true)

    const prompt = `Given an empty repository, write calculator application that exposes a function that takes in a string and returns the result of the calculation. Assume you have already chosen to use typescript. You should only include steps that are pure coding steps such as writing content and running tests. You are not intending to publish this application, deploy it, or do anything other than write the code. This should be a single repo. Furthermore, you will have no direct outside help, you may 'plan' but you may not do online research. You may use packages if you want. Assume you have good knowledge of the language and the libraries you are using.`;
    const withPrompt = await Actions.CommandModelAction.execute({message: prompt, context: rootContext});
    
    // Determine initial steps
    const result = await Actions.ThinkProcedureAction.execute({
        text: ``,
        context: withPrompt.context
    });

    // Try to follow that plan
    const solved = await Actions.SolveMultipleGoalAction.execute({
        goals: result.steps,
        context: withPrompt.context
    });
}

