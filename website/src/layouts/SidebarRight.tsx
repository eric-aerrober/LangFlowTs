import React from "react"
import { useState } from "react"
import { useRecoilValue } from "recoil"
import { clickedNode } from "../state/inspect/chosenNode"
import { Context } from "../components/conversation"
import { useGraphState } from "../state/network/network.hook"
import network from "../state/network/network.class"
import ReactMarkdown from "react-markdown"

export function SidebarRight () {
    useGraphState();

    const selected = useRecoilValue(clickedNode)
    const nodeValue = network.getNode(selected) as any
    const [open, setOpen] = useState(false)
    const closedTransform = "translateX(95%)"
    const toggleTransform = open ? "translateX(0)" : closedTransform
    const toggle = () => setOpen(!open)

    const runScript = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
    }

    if (!nodeValue) {
        return null;
    }

    if (nodeValue.origin == 'log'){
        return <div id="sidebar-right" style={{ transform: toggleTransform }} onClick={toggle}>
            <pre>
                <code>
                    {JSON.stringify(nodeValue.metadata.object.data, null, 2)}
                </code>
            </pre>
        </div>
    }

    let display = (nodeValue.metadata?.display) || nodeValue.metadata?.object?.display

    if (display){
        display = (
            <pre>
                <code>
                    {JSON.stringify(display, null, 2)}
                </code>
            </pre>
        )
    }

    return <div id="sidebar-right" style={{ transform: toggleTransform }} onClick={toggle}>
        {display}
        <Context {...nodeValue.metadata?.object?.context}/>
    </div>

}