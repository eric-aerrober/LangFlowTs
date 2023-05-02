import { useEffect, useRef } from 'react'
import { lookupId, setSelectedId, updatePosition, useRerender } from '../state/manual/nodeNetwork'
import { RowItem, RowItemProps } from './rowItem'
import { useSetRecoilState } from 'recoil'
import { clickedNode } from '../state/inspect/chosenNode'
import { useGraphState } from '../state/network/network.hook'
import { NodeContainer, NodeItem } from '../state/network/network.types'
import network from '../state/network/network.class'

export function WorldNode ({node} : {node:NodeContainer}){
    useGraphState();
    
    const ref = useRef(null)
    const mouseDown = () => network.selectNode(node.id)
    const mouseUp = () => network.unsetSelectedNode()
    
    // useEffect(() => {
    //     if (ref.current) {
    //         let node: HTMLElement = ref.current
    //         let rect = node.getBoundingClientRect()
    //         updatePosition(nodeId, rect, false);
    //     }
    // }, [ref.current, x, y])

    const items = node.items.map((child) => 
        <NodeElement key={child.id} node={child} />
    );

    if (!network.shouldShow(node.id)) {
        return <div />
    }

    const style = {
        left: node.position.x,
        top: node.position.y,
    }

    return <div ref={ref}
        onMouseDown={mouseDown}
        onMouseUp={mouseUp} 
        className='dragable nodeContainer' 
        style={style}>
        <div className='nodeTitle'>
            {node.name}
            <div 
                className='nodeTitleHook' 
                style={{background: node.color || 'blue'}} 
                onClick={(e) => {
                    network.toggleVisability(node.id)
                    e.preventDefault();
                    e.stopPropagation();
                }}
            />
        </div>
        <div className='nodeContent'>
            {items}
        </div>
    </div> 
}

function NodeElement({node} : {node:NodeItem}) {
    useGraphState();

    const ref = useRef(null)
    const setClicked = useSetRecoilState(clickedNode)

    // if (ref.current) {
    //     let node: HTMLElement = ref.current
    //     let rect = node.getBoundingClientRect()
    //     if (data.position.lastX !== rect.x || data.position.lastY !== rect.y){
    //         setTimeout(() => updatePosition(props.id, rect, true));
    //     }
    // }

    let contentObject: Partial<RowItemProps> = {
        onClick: () => setClicked(node.id),
        spinning: node.loading,
        color: "light-grey",
        icon: node.emoji,
        title: node.name,
        subtitle: node.origin,
    }

    switch (node.origin){
        case 'get-context-result' || 'get-context-request':
            contentObject = {
                ...contentObject,
                color: "#03b98f",
            }
            break;
        case 'child-context-created': 
            contentObject = {
                ...contentObject,
            }
            break;
        default:
            break;
    }

    return <div ref={ref}>
        <RowItem {...contentObject as any} />
    </div>

}