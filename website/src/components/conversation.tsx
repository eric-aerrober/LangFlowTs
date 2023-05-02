import { ReactMarkdown } from "react-markdown/lib/react-markdown"

interface ContextProps {
    role: string
    name: string
    messages: string[]
}

export function Context (props: ContextProps) {

    if (!props.messages) {
        return <div/>
    }

    return <div>
        <div className="conversation-name">
            Conversation: {props.name}
        </div>
        <div className="conversation-role">
            <div className="section-label-left" style={{backgroundColor: '#84d8ff'}}>
                Agent Role
            </div>
            {props.role}
        </div>
        <div>
            {props.messages.map((message, index) => 
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
                    <ReactMarkdown>
                        {message}
                    </ReactMarkdown>
                </div>
            )}
        </div>
        <hr/>  
    </div>

}