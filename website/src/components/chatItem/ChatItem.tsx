import { ContextItemIcon } from "../contextItem/ContextItemIcon";
import { ChatItemTitle } from "./ChatItemTitle";
import { ChatMetadata } from "./ChatMetadata";

export function ChatItem ({chat}: {chat: any}) {
    
    return (
        <div className="context-item">
            <ContextItemIcon type="context" parentId="" id="" />
            <ChatMetadata chat={chat}/>
            <ChatItemTitle chat={chat} />
        </div>
    )
}