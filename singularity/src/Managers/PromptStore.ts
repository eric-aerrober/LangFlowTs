/*
    A prompt store is a collection of prompts that can be used as templates for prompts
*/

import * as fs from 'fs';

// Collection of prompts that have been loaded
const prompts : Map<string, string> = new Map<string, string>();

// Loading prompts from files
export function loadPromptsFromDirectory (path: string) {

    fs.readdirSync(path)
        .forEach(file => {
            
            if (fs.lstatSync(`${path}/${file}`).isDirectory()) {
                loadPromptsFromDirectory(`${path}/${file}`);
                return;
            }

            const data = fs.readFileSync(`${path}/${file}`).toString();
            loadPrompt(file, data);
        })

}

export function loadPrompt (name: string, text: string) {
    prompts.set(name, text);
}

// Use prompts for a given name

type promptMixins = {[key: string]: string};

export function usePrompt (name: string, data?: promptMixins) {
    let promptData = prompts.get(name);

    if (!promptData){
        throw new Error(`Prompt ${name} not found`);
    }
    
    if (data) {
        Object.keys(data).forEach(key => {
            promptData = promptData?.replaceAll(`{${key}}`, data[key]);
        })
    }
    
    return promptData;
}
