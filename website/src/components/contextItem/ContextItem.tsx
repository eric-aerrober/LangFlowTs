import { useRecoilState } from "recoil";
import { dataObjects } from "../../state/dataObjects";
import { Spinner } from "../spinner";
import { ContextItemIcon } from "./ContextItemIcon";
import { ContextItemTitle } from "./ContextItemTitle";
import { ContextItemTimeline } from "./ContextItemTimeline";
import { ContextMetadata } from "./ContextMetadata";
import { selectedObjects } from "../../state/selectedObjects";
import { useEffect } from "react";
import { LoadingStates, setLoading } from "../../state/loadingState";

export function ContextItem ({id, parentId}: {id: string, parentId: string}) {

    const [objects] = useRecoilState(dataObjects)    
    const [selectedObjectsData, _] = useRecoilState(selectedObjects)
    const [loadingStates, setLoadingStates] = useRecoilState(LoadingStates)
    const actionContextObject = objects[id]
    const parentContextObject = objects[parentId]
    const open = selectedObjectsData.includes(id)

    // Sort out of i should be loading or not
    // Either 1. I am loading, 
    // Or 2. A child of mine is loading
    const iamLoading = actionContextObject?.loading
    const childIsLoading = actionContextObject?.childrenActionContextIds?.some(childId => loadingStates[childId])
    const shouldBeLoading = iamLoading || childIsLoading
    useEffect(() => setLoading(id, shouldBeLoading, setLoadingStates), [shouldBeLoading])

    if (!actionContextObject) return <Spinner />

    return (
        <div className="context-item">
            {
                open && <div className="icon-bubble-line" />
            }
            <ContextItemIcon 
                type={actionContextObject.type} 
                id={id} 
                parentId={parentId} 
                loading={shouldBeLoading}
            />
            <ContextMetadata 
                obj={actionContextObject} 
            />
            <ContextItemTitle 
                obj={actionContextObject} 
            />
            <ContextItemTimeline obj={actionContextObject} shown={open}/>
        </div>
    )

}