import { Chat } from "../../state/dataObjects";

export function ChatItemTitle ({chat}: {chat: Chat}) {
    return (
        <div className="context-item-title">
            <div className="context-item-title-name">
                {chat.name} Chat
            </div>
        </div>
    )
}