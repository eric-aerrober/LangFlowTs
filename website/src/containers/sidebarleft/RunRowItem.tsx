import TimeAgo from "javascript-time-ago";
import { AgentRun } from "../../state/runs";
import { useRecoilState } from "recoil";
import { selectedRun } from '../../state/selectedRun'

interface RunRowItemProps {
    agentRun: AgentRun,
    recordedId: string
}

export function RunRowItem ({agentRun, recordedId}: RunRowItemProps) {

    const [selected, setSelected] = useRecoilState(selectedRun)
    const isSelected = selected === recordedId
    const items = Object.keys(agentRun.data).length

    const timeAgo = new TimeAgo('en-US')
    const time = timeAgo.format(new Date(
        agentRun.timestamp
    ))

    return (
        <div className="row-item" onClick={() => {
            setSelected(recordedId)
        }}>
            <div className="pad">
                {
                    isSelected &&
                        <div className="selectedIndicator" />
                }
                {
                    !isSelected &&
                        <div className="notSelectedIndicator" />
                }
            </div>
            <div className="pad">
                {agentRun.id.substring(0, 8)}
            </div>
            <div className="pad">
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'end'}}>
                    <div>
                        {items} actions
                    </div>
                    <div style={{fontSize: '10px'}}>
                        {time}
                    </div>
                </div>
            </div>
        </div>
    );

}