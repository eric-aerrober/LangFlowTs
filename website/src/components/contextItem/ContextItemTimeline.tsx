import { DataObject } from "../../state/dataObjects";
import { ChatItem } from "../chatItem/ChatItem";
import { ContextItem } from "./ContextItem";

export function ContextItemTimeline ({obj, shown} : {obj: DataObject, shown: boolean}) {

    const isChat = (id: string) => {
        return obj.chatContexts.find((chat) => chat?.id === id)
    }

    const items = obj.timeline
        .filter(
            (objId) => objId.id != obj.id
        )
        .map((objId) => {
            const chat = isChat(objId.id)
            if (chat) {
                return <ChatItem chat={chat} key={objId.id}/>
            }
            else {
                return <ContextItem id={objId.id} key={objId.id} parentId={obj.id}/>
            }
        }   
    )

    return <div className={"context-item-timeline" + (shown ? '' : ' hide')}>
        <div className="icon-bubble-line" />
        {items}
    </div>
}