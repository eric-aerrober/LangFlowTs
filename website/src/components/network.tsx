import { ReactNode, useState } from "react";
import { useGraphState } from "../state/network/network.hook";
import network from "../state/network/network.class";
import { WorldNode } from "./worldNode";
import { CurvedLine } from "./connection";

export default function Network() {
    useGraphState();

    const elements = network
        .allContainers()
        .map(node => <WorldNode key={node.id} node={node}/>)

    const connections = network
        .allContainers()
        .filter((node) => node.parent)
        .filter((node) => node.id !== 'root')
        .map(node => {
            if (!node.parent) return
            const parentNode = network.getItem(node.parent)
            const parentContainer = network.getContainer(parentNode.parent)
            if (!network.shouldShow(parentContainer.id)) return
            const parentId = parentContainer.items.findIndex((item) => item.id === parentNode.id)
            const node1Start = {
                x: node.position.x + 10,
                y: node.position.y + 10
            }
            const node2Start = {
                x: parentContainer.position.x + 120,
                y: parentContainer.position.y + 34 + parentId * 22 
            }
            return <CurvedLine id={node.id} visible={node.visible} start={node1Start} end={node2Start} key={node.id} />
        })

    return <div className='network' onMouseMove={(e) => network.moveMouse(e as any)}>
        {elements}
        {connections}
    </div>

}