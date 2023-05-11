import { useRecoilState } from "recoil";
import { selectedRun } from "../../state/selectedRun";
import { agentRunCollection } from "../../state/runs";
import { ContextItem } from "../../components/contextItem/ContextItem";

export function MainView() {

    const [selected] = useRecoilState(selectedRun)
    const [runs] = useRecoilState(agentRunCollection)

    if (!selected) {
        return (
            <div className="content-right">
                Select a run to view
            </div>
        )
    }

    const run = runs.runs[selected]
    const runRoot = run.root

    return (
        <div className="content-right">
            <ContextItem id={runRoot} parentId=""/>
        </div>
    );
}