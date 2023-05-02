// internal simple uuid implementation
export function uuid(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function randomId(): number {
    return Math.floor(Math.random() * 1000000000);
}
