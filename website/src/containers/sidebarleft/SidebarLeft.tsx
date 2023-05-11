import { useEffect } from "react";
import { beginPolling } from "../../network/polling";
import { useRecoilState } from "recoil";
import {  agentRunCollection } from "../../state/runs";
import { RunRowItem } from "./RunRowItem";
import SidebarTitle from "./SidebarTitle";
import { Spinner } from "../../components/spinner";
import { dataObjects } from "../../state/dataObjects";
import { selectedRun } from "../../state/selectedRun";
import SidebarFooter from "./SidebarFooter";
import SelectedInfo from "./SelectedInfo";

export function SidebarLeft () {

    const [agentRuns, setAgentRuns] = useRecoilState(agentRunCollection)
    const [_, setDataObjects] = useRecoilState(dataObjects)
    const [selected, setSelected] = useRecoilState(selectedRun)

    useEffect(() => {
        beginPolling(setAgentRuns, setDataObjects)
    }, [])

    const loading = !agentRuns.lastUpdated;

    useEffect(() => {
        if (!loading && !selected){
            setSelected(Object.keys(agentRuns.runs)[0])
        }
    }, [loading])

    const runRows = Object.entries(agentRuns.runs).map(([recordedId, agentRun]) => {
        return <RunRowItem
            key={agentRun.id}
            agentRun={agentRun}
            recordedId={recordedId}
        />
    })

    return (
        <div className="sidebar-left">
            <SidebarTitle />
            <div className="sidebar-content">
                {runRows}
                {loading && <Spinner />}
            </div>
            <SelectedInfo />
            <SidebarFooter/>
        </div>
    );

}