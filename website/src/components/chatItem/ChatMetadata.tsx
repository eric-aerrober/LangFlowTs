import { useRecoilState } from "recoil";
import { Chat, DataObject } from "../../state/dataObjects";
import { modalState } from "../../state/modalState";
import { ActionButton } from "../contextItem/ContextMetadata";
import { IconByName } from "../icon";

export function ChatMetadata ({chat}: {chat: Chat}) {

    const {item, color} = IconByName({name: "chat", size: 14})

    return (
        <div className="context-metadata">
            <ActionButton 
                content={item}
                color={color}
                modalData={chat} 
            />
        </div>
    )

}