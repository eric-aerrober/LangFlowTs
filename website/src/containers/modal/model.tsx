import { useRecoilState } from "recoil";
import { modalState } from "../../state/modalState";
import { ChatInModal } from "./chatInModal";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

export function Modal () {

    const [state, setState] = useRecoilState(modalState);

    if (!state.open) {
        return null;
    }

    const isString = typeof state.data === "string";

    return (
        <div className="modal" onClick={() => setState({open: false, data: undefined})}>
            <div className="modal-content" onClick={(e) => {e.preventDefault(); e.stopPropagation()}}>
                {
                    state.data?.parentActionContextId &&
                        <ChatInModal chat={state.data} />
                }
                {
                    !state.data?.parentActionContextId &&
                    (
                        <div className="modal-data">
                            {
                                !isString ?
                                (
                                    <code>
                                        <pre>
                                            {JSON.stringify(state.data, null, 2)}
                                        </pre>
                                    </code>
                                )
                                : (
                                    <div style={{padding: 20, fontSize: 12}}>
                                        <ReactMarkdown>
                                           {state.data}
                                        </ReactMarkdown>
                                    </div>
                                )
                            }
                            
                        </div>
                    )
                }
                
                <div className="modal-close" onClick={() => setState({open: false, data: undefined})}>
                    Close
                </div>
            </div>
        </div>
    )

}