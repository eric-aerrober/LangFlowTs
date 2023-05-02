/*
    This event bus will be used as a global event bus for the application.
    Used to consume events for visualizing the execution of the language flow.
*/

export interface EventBusEvent {
    eventType: string
    message?: string
    object?: any
}

let subscriberId = 0;
let subscribers = new Map<string, Function>();
let subscribersByType = new Map<string, Function[]>();

export function publish (EventBusEvent: EventBusEvent) {

    const subscribers = subscribersByType.get(EventBusEvent.eventType) || [];
    const allSubscribers = subscribersByType.get('*') || [];

    for (const callback of allSubscribers) {
        callback(EventBusEvent);
    }

    for (const callback of subscribers) {
        callback(EventBusEvent);
    }

}
    
export function subscribe (event: string, callback: Function) {
    const id = subscriberId++;
    const existing = subscribersByType.get(event)

    if (existing) {
        existing.push(callback);
    } else {
        subscribersByType.set(event, [callback]);
    }

    subscribers.set(id.toString(), callback);
    return id.toString();
}
    
export function unsubscribe (id: string) {
    subscribers.delete(id);
    subscribersByType.forEach((value, key) => {
        subscribersByType.set(key, value.filter(v => v !== subscribers.get(id)));
    })
}
