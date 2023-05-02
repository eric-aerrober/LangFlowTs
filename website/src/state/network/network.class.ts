import { killGpt4 } from '../../singularity/Models/models/Gpt4';
import { updateGraphState } from './network.hook';
import * as T from './network.types'

class NetworkGraph {

    private nodeById: Map<string, T.Node> = new Map();
    private selectedNodeId: T.NodeId | null = null;
    private selectedAtPosition: T.Point | null = null;
    private activeContainerStack: T.NodeId[] = ['root'];
    private calls: {tokens: number}[] = [];
    private scale = 1;
    
    constructor () {
        document.addEventListener('keydown', (e) => {
            // escape
            if (e.keyCode === 27) {
                this.unsetSelectedNode();
                updateGraphState();
            }
            // R
            if (e.keyCode === 82) {
                this.refreshPositions();
                updateGraphState();
            }
            // E
            if (e.keyCode === 69) {
                this.hideAll();
                updateGraphState();
            }
            // Q
            if (e.keyCode === 81) {
                killGpt4()
            }
        });
        this.init()
    }

    public init () {
        const root: T.NodeContainer = {
            id: 'root',
            name: 'Root',
            type: 'container',
            parent: '-1',
            position: {
                x: 0,
                y: 0,
            },
            items: [],
            visible: true,
        }
        this.nodeById.set(root.id, root);
    }

    public addNodeItem (item: T.NodeItem) {
        let container = this.getContainer(item.parent);
        container.items.push(item);
        this.nodeById.set(item.id, item);
        updateGraphState();
    }

    public addNodeContainer (container: T.NodeContainer) {
        let item = this.getItem(container.parent);
        item.child = container.id;
        this.nodeById.set(container.id, container);
        this.activeContainerStack.push(container.id);
        updateGraphState();
    }

    public selectNode (id: T.NodeId) {
        const node: T.NodeContainer = this.nodeById.get(id) as any;
        this.selectedNodeId = id;
        this.selectedAtPosition = {...node.position}
    }

    public moveMouse (e: MouseEvent) {
        if (this.selectedNodeId && this.selectedAtPosition){
            let node = this.nodeById.get(this.selectedNodeId) as T.NodeContainer;
            node.position.x = this.selectedAtPosition.x + e.movementX/this.scale;
            node.position.y = this.selectedAtPosition.y + e.movementY/this.scale;
            this.selectNode(this.selectedNodeId);
            updateGraphState();
            e.preventDefault();
            e.stopPropagation();
        }
    }

    public setScale (newScale: number) {
        this.scale = newScale;
    }

    public unsetSelectedNode () {
        this.selectedNodeId = null;
    }

    public allIds () {
        return Array.from(this.nodeById.keys());
    }

    public allContainers () {
        return Array.from(this.nodeById.values()).filter(node => node.type === 'container') as T.NodeContainer[];
    }

    public getNode (id: T.NodeId) {
        return this.nodeById.get(id);
    }

    public getContainer (id: T.NodeId) {
        return this.nodeById.get(id) as T.NodeContainer;
    }

    public getItem (id: T.NodeId) {
        return this.nodeById.get(id) as T.NodeItem;
    }

    public intersectsAnything (position: T.Point){
        return this.allContainers()
            .filter(node => this.shouldShow(node.id))
            .some(container => {
                return this.intersectsContainer(container, position);
            });
    }

    public intersectsContainer (container: T.NodeContainer, position: T.Point) {

        const { x, y } = container.position;
        const { width, height } = this.getContainerSize(container);

        return (
            position.x >= x &&
            position.x <= x + width &&
            position.y >= y &&
            position.y <= y + height
        );
    }

    public getContainerSize (container: T.NodeContainer) {
        return {
            width: 120,
            height: 50 + container.items.length * 15,
        }
    }

    public findPositionToPlace (from: T.NodeId) {

        const fromContainer = this.getContainer(this.getItem(from).parent);

        for (let x = 150; x < 500; x += 10) {
            for (let y = 0; y < 500; y += 10) {
                const position = { 
                    x: fromContainer.position.x + x,
                    y: fromContainer.position.y + y,
                }
                if (!this.intersectsAnything(position)) {
                    return position;
                }
            }
        }

        return {
            x: fromContainer.position.x + 150,
            y: fromContainer.position.y,
        }
        
    }

    public getActiveContainer() {
        return this.activeContainerStack[this.activeContainerStack.length - 1];
    }

    public getActiveItem() {
        const activeContainer = this.getActiveContainer();
        const container = this.getContainer(activeContainer);
        return container.items[container.items.length - 1];
    }

    public setActiveContainer(id: T.NodeId) {
        this.activeContainerStack.push(id);
    }

    public unsetActiveContainer() {
        this.activeContainerStack.pop();
    }

    public clear() {
        this.nodeById.clear();
        this.activeContainerStack = ['root'];
        this.selectedNodeId = null;
        this.selectedAtPosition = null;
        this.init();
    }

    public toggleVisability (nodeid: T.NodeId) {
        const node = this.getContainer(nodeid);
        node.visible = !node.visible;
        updateGraphState();
    }

    public shouldShow (nodeid: T.NodeId): boolean {
        if (nodeid === 'root') {
            return true;
        }
        const node = this.getContainer(nodeid);
        if (!node.visible) {
            return false;
        }
        const row = this.getItem(node.parent);
        return this.shouldShow(row.parent);
    }

    public refreshPositions () {

        // First, record all shown nodes
        const allShown = []
        const nodes = ['root']
        while (nodes.length > 0) {
            const node = nodes.shift() as string;
            const obj = this.getContainer(node);
            if (this.shouldShow(obj.id)) {
                allShown.push(node);
                obj.items.map((row) => {
                    const item = this.getItem(row.id);
                    if (item.child){
                        nodes.push(item.child);
                    }
                })
            }
        }

        // Set all to not visible
        allShown.forEach(node => this.getContainer(node).visible = false);

        // Then add back each node, in order
        allShown.forEach(node => {
            const obj = this.getContainer(node);
            obj.visible = true;
            if (obj.id != 'root') {
                obj.position = this.findPositionToPlace(obj.parent);
            }
        })


    }

    public hideAll () {
        this.allContainers().forEach(node => node.visible = false);
        updateGraphState();
    }

    public addCall(tokens: number){
        this.calls.push({tokens});
    }

    public getCalls(){
        return this.calls;
    }
    
}

let network = new NetworkGraph();



export default network;