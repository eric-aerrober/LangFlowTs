import React from 'react';
import { ReactNode } from 'react';
import { atom, selectorFamily, DefaultValue } from 'recoil';

/*
    An invoke node is a node on the graph itself
    A ndoe has data about the node, has a position, and relations to other nodes
    Nodes also have children nodes that are contained within them
*/

interface NodeInfo {
    // id is the unique identifier for the node
    id: string;

    // indicate if the children of this node are hidden
    expanded: boolean;

    // data about content
    content: NodeInfo[];
    isSelfChild: boolean;
    parent?: string;

    // data about the node itself
    name: string;
    startTime: number;
    spinning: boolean;
    additionalData: any;

    // Connections leave the node
    connectionIds: string[];

    // Position is the position of the node on the graph
    position: {
        x: number;
        y: number;
        width: number;
        height: number;
        lastX: number;
        lastY: number;
    }
}

interface newNodeInfo {
    id: string;
    name: string;
}

// A node is a node on the graph itself
interface NodeInfoMap {
    [nodeId: string]: NodeInfo;
}
let nodeInfoMap: NodeInfoMap = {};

// // Various connectors subscribe to a node's position and may choose to update
// interface ListeningPositionMap {
//     [nodeId: string]: string[];
// }
// let listeningPositionMap: ListeningPositionMap = {};

// // A connection is a line between two nodes, store as a set of strings
// type ConnectionMap = Set<string>;
// let connectionMap: ConnectionMap = new Set();


/*
    State rendering hooks
*/

let renderId = 0;
let allowRerender = (id: number) => {};
let waitingToRender = false
let doRerender = () => {
    if (waitingToRender) return;
    
    setTimeout(() => {
        allowRerender(++renderId);
        Object.keys(forceChildRenders).forEach((key) => {
            forceChildRenders[key]();
        });
        waitingToRender = false;
    }, 5);
    waitingToRender = true;
}
export const setAllowRerender = (func: (id: number) => void) => {
    allowRerender = func;
}

/*
    Dragging hooks
*/

let selectedId: string | null = null;
let startPosition: {x: number, y: number} | null = null;
let scale = 1;
export function setNodeScale (newScale: number) {
    scale = newScale;
}
export function setSelectedId (id: string | null) {
    selectedId = id;
    if (id !== null)
        startPosition = nodeInfoMap[id].position ?? null;
}
export function isAnySelected () {
    return selectedId !== null;
}

document.addEventListener('mousemove', (e) => {
    if (selectedId && startPosition) {
        let node = nodeInfoMap[selectedId];
        node.position.x = startPosition.x + (e.movementX / scale);
        node.position.y = startPosition.y + (e.movementY / scale);
        e.stopPropagation()
        doRerender();
    }
});

/*
    Rerender Hooks
*/

let forceChildRenders = {} as {[nodeId: string]: () => void};
export function setForceChildRenders (nodeId: string, func: () => void) {
    forceChildRenders[nodeId] = func;
}
export function getForceChildRenders (nodeId: string) {
    return forceChildRenders[nodeId];
}
export function useRerender (id: string) {
    const [_val, setVal] = React.useState(0);
    setForceChildRenders(id, () => setVal(_val + 1));
}
export function reRenderAllChildren (id: string) {
    let node = nodeInfoMap[id];
    if (node) {
        node.content.forEach((child) => {
            reRenderAllChildren(child.id);
            forceChildRenders[child.id]();
        });
    }
}

/*
    Updates to state management
*/

export function clear () {
    nodeInfoMap = {};
    doRerender();
}

export function spawnNode (id: string, name: string) {

    let newNode: NodeInfo = {
        id: id,
        expanded: false,
        content: [],
        isSelfChild: false,
        name: name,
        startTime: Date.now(),
        connectionIds: [],
        additionalData: {},
        spinning: false,
        position: {
            x: 500,
            y: 500,
            width: 0,
            height: 0,
            lastX: -1,
            lastY: -1,
        }
    }

    nodeInfoMap[newNode.id] = newNode;
    doRerender();

}

export function updatePosition (id: string, position: {x: number, y: number, width: number, height: number}, child: boolean) {
    let node = nodeInfoMap[id];
    if (node.position.width === position.width && node.position.height === position.height) {
        return
    }
    node.position.width = position.width / scale;
    node.position.height = position.height / scale;
    node.position.lastX = position.x;
    node.position.lastY = position.y;
    if (child && node.parent) {
        let parent = nodeInfoMap[node.parent];
        let deltaX = node.position.lastX - parent.position.lastX;
        let deltaY = node.position.lastY - parent.position.lastY;
        node.position.x = parent.position.x + (deltaX) / scale;
        node.position.y = parent.position.y + (deltaY) / scale;
    }
    reRenderAllChildren(id);
    doRerender();
}

export function makeParent (parentId: string, childId: string) {
    let parent = nodeInfoMap[parentId];
    let node = nodeInfoMap[childId];
    parent.connectionIds.push(childId);
    let newPos = tryFindSpace(parentId);
    if (newPos){
        node.position.x = newPos.x;
        node.position.y = newPos.y;
    }
    doRerender();
}

export function addChild (parentId: string, childId: string) {
    let parent = nodeInfoMap[parentId];
    let node = nodeInfoMap[childId];
    parent.content.push(node);
    node.isSelfChild = true;
    node.parent = parentId;
    doRerender();
}

export function addAdditionalData (id: string, data: any) {
    let node = nodeInfoMap[id];
    node.additionalData = {
        ...node.additionalData,
        ...data,
    }
    doRerender();
}

export function setSpinning (id: string, spinning: boolean) {
    let node = nodeInfoMap[id];
    node.spinning = spinning;
    doRerender();
}

export function lookupId (id: string) {
    return nodeInfoMap[id];
}

export function listAllIds () {
    return Object.keys(nodeInfoMap);
}

/*
    Collision
*/

export function isValidPlace(x: number, y: number){
    for (let id in nodeInfoMap){
        const position = nodeInfoMap[id].position;
        const points = [
            {x: position.x, y: position.y},
            {x: position.x + position.width, y: position.y},
            {x: position.x, y: position.y + position.height},
            {x: position.x + position.width, y: position.y + position.height},
        ]

        for (let point of points){
            if (Math.abs(point.x - x) < 150 && Math.abs(point.y - y) < 10){
                return false;
            }
        }
    }
    return true;
}

export function tryFindSpace(parent: string){

    const parentNode = nodeInfoMap[parent];
    const parentPosition = parentNode.position;

    const startX = parentPosition.x + parentPosition.width;
    const startY = parentPosition.y;

    for (let offx = 250; offx < 500; offx += 100 ){
        for (let offy = 0; offy < 300; offy += 50){
            if (isValidPlace(startX + offx, startY + offy)){
                return {x: startX + offx, y: startY + offy};
            }
        }
    }


}