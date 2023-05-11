import ReactMarkdown from "react-markdown";
import { Chat } from "../../state/dataObjects";

export function ChatInModal ({chat}: {chat: Chat}) {
    
    return (
        <div>
            <div className="conversation-name">
                Conversation: {chat.name}
            </div>
            <hr/>  
            <div className="conversation-role">
                <div className="section-label-left" style={{backgroundColor: '#84d8ff'}}>
                    Agent Role
                </div>
                {chat.role}
            </div>
            <div>
                {chat.messages.map((message, index) => 
                    <div
                        className={index % 2 === 0 ? "conversation-user" : "conversation-agent"}
                        key={index}>
                        <div 
                            className={index % 2 === 0 ? "section-label-right" : "section-label-left"}
                            style={{
                                backgroundColor: index % 2 === 0 ? '#e984fd' : '#ff8f8f'
                            }}>
                            {
                                index % 2 === 0 ? "User" : "Agent"
                            }
                        </div>
                        <ReactMarkdown className="line-break">
                            {message}
                        </ReactMarkdown>
                    </div>
                )}
            </div>
        </div>
    )
}