import { DataObject } from "../../state/dataObjects";

export function ContextItemTitle ({obj}: {obj: DataObject}) {
    return (
        <div className="context-item-title">
            <div className="context-item-title-name">
                {obj.name} Context
            </div>
            {
                obj.timeline.length > 1 &&
                    <div className="context-item-title-children">
                        {obj.timeline.length -1} children
                    </div>
            }   
        </div>
    )

}