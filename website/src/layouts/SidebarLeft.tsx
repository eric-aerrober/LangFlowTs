import React, { useEffect } from "react"
import { useState } from "react"
import { testWorkflow } from "../workspace/test"
import { clear } from "../state/manual/nodeNetwork"

export function SidebarLeft () {

    const [open, setOpen] = useState(true)
    const closedTransform = "translateX(-95%)"
    const toggleTransform = open ? "translateX(0)" : closedTransform
    const toggle = () => setOpen(!open)

    const runScript = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        clear();
        testWorkflow();
    }

    useEffect(() => {
        testWorkflow();
    }, []);

    return <div id="sidebar-left" style={{ transform: toggleTransform }} onClick={toggle}>
        <button className='action-button' onClick={runScript}>
            Test Flow
        </button>
    </div>

}