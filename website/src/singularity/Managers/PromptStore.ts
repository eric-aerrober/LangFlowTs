import {loadPrompt} from './Interface'

/*
    The prompt store is a collection of prompts that can be used as templates for prompts
*/

const prompts : Map<string, string> = new Map<string, string>();

export async function getRaw (name: string) {
    if (!prompts.has(name)) {
        const raw: string = await loadPrompt(name) as any;
        prompts.set(name, raw);
    }
    return prompts.get(name) || '';
}

export async function get (name: string, fillers?: {[key: string]: string}) {
    const raw = await getRaw(name);
    return fill(raw, fillers);
}

export function fill (raw: string, fillers?: {[key: string]: string}) : string {
    let filled = raw;
    if (fillers)
        Object.keys(fillers).forEach(key => {
            filled = filled.replace(`{${key}}`, fillers[key]);
        })
    return filled;
}
