import { useRecoilState } from "recoil";
import { DataObject } from "../../state/dataObjects";
import { modalState } from "../../state/modalState";
import { IconByName } from "../icon";

export function ActionButton ({content, modalData, color}: {content: any, modalData: any, color?: string}) {

    const [state, setState] = useRecoilState(modalState);

    return (
        <div 
            className="context-action-button"
            onClick={() => setState({open: true, data: modalData})}
            style={{
                backgroundColor: color || "red"
            }}
        >
            {content}
        </div>
    )
}

export function ContextMetadata ({obj}: {obj: DataObject}) {

    const metadata = obj.metadata;
    const items = []


    if (metadata.modelQuery) {
        const {item, color} = IconByName({name: "modelQuery", size: 14})
        items.push(
            <ActionButton 
                key={'modelQuery'}
                content={item}
                color={color}
                modalData={metadata.modelQuery} 
            />
        )
    }

    if (metadata.result?.summaryMessage) {
        const {item, color} = IconByName({name: "summary", size: 14})
        items.push(
            <ActionButton
                key={'summary'}
                content={item}
                color={color}
                modalData={metadata.result?.summaryMessage}
            />
        )
    }

    if (metadata?.tools) {
        const {item, color} = IconByName({name: "tool", size: 14})
        items.push(
            <ActionButton
                key={'tools'}
                content={item}
                color={color}
                modalData={metadata.tools}
            />
        )
    }

    if (metadata?.format) {
        const {item, color} = IconByName({name: "format", size: 14})
        items.push(
            <ActionButton
                key={'format'}
                content={item}
                color={color}
                modalData={metadata.format}
            />
        )
    }
    

    if (items.length === 0) return null
    
    return (
        <div className="context-metadata">
            {items}
        </div>
    )

}