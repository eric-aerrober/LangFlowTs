import { uuid } from "../../utils/uuid";
import network from "../network/network.class";
import { updateGraphState } from "../network/network.hook";
import { addAdditionalData, addChild, makeParent, setSpinning, spawnNode } from "./nodeNetwork";

export function onEvent (event: any) {
    
    switch (event.eventType) {
        case "context-created":
            network.addNodeItem({
                id: event.object.context.id,
                loading: false,
                origin: event.eventType,
                metadata: event,
                name: event.object.context.name,
                type: 'item',
                emoji: 'bookmark.png',
                parent: network.getActiveContainer(),
                visible: true,
            })
            break;
        case "context-updated":
            network.addNodeItem({
                id: event.object.context.id,
                loading: false,
                origin: event.eventType,
                metadata: event,
                name: event.object.context.name,
                type: 'item',
                emoji: 'pencil.png',
                parent: network.getActiveContainer(),
                visible: true,
            })
            break;
        case "log":
            network.addNodeItem({
                id: uuid(),
                loading: false,
                origin: 'log',
                metadata: event,
                name: 'Log Object',
                type: 'item',
                emoji: 'sparkle.png',
                parent: network.getActiveContainer(),
                visible: true,
            })
            break;
        case "begin-action":
            let emoji = 'hammer.png';
            if (event.object.name.includes('Use Tool')) {
                emoji = 'robot.png';
            }
            else if (event.object.name.includes('File')) {
                emoji = 'file_folder.png';
            }
            else if (event.object.name.includes('Testing')) {
                emoji = 'test-tube.svg';
            }
            else if (event.object.name.includes('Goal')) {
                emoji = 'target.svg';
            }
            else if (event.object.name.includes('Thinking')) {
                emoji = 'brain.svg';
            }
            network.addNodeItem({
                id: event.object.id,
                loading: false,
                origin: 'action',
                metadata: event,
                name: event.object.name,
                type: 'item',
                emoji,
                parent: network.getActiveContainer(),
                visible: true,
            })
            network.addNodeContainer({
                id: event.object.id + '-container',
                name: event.object.name,
                type: 'container',
                parent: network.getActiveItem().id,
                position: network.findPositionToPlace(network.getActiveItem().id),
                items: [],
                visible: true,
            })
            break;
        case "end-action":
            const endNode = network.getItem(event.object.id)
            if (endNode) {
                endNode.metadata = event.object;
            }
            network.unsetActiveContainer();
            break;
        case "get-context-prompt":
            network.addNodeItem({
                id: event.object.interactionId,
                loading: true,
                origin: event.eventType,
                metadata: event,
                name: 'Query OpenAI GPT4',
                type: 'item',
                emoji: 'openai.svg',
                parent: network.getActiveContainer(),
                visible: true,
            })
            break;
        case "get-context-result":
            const node = network.getItem(event.object.interactionId);
            node.loading = false;
            node.metadata = event;
            updateGraphState();
            break;

        default:
            console.log("Unknown Event: ", event)
    }

}