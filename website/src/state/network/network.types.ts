export type NodeId = string

export interface Point {
    x: number;
    y: number;
}

export interface Node {
    id: NodeId;
    name: string;
    type: 'container' | 'item';
    color?: string;
    emoji?: string;
    parent: NodeId;
    visible: boolean;
}

export interface NodeContainer extends Node {
    type: 'container';
    position: Point;
    items: NodeItem[];
}

export interface NodeItem extends Node {
    type: 'item';
    loading: boolean;
    origin: string;
    metadata: any;
    child?: NodeId;
}
