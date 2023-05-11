import * as fs from 'fs';
import { Gpt4 } from './Models';
import { loadPromptsFromDirectory } from './Managers/PromptStore';
import { initialize } from './Managers/Logger';
import { resetWorkspace, setWorkspace } from './Managers/Files';

interface SystemConfig {
    apiKey: string,
    workspace?: string,
    resetWorkspace?: boolean,
}

export async function setup (config: SystemConfig) {

    // We need to make sure that the cache directory exists
    if (!fs.existsSync('./cache')) {
        fs.mkdirSync('./cache');
    }

    // We need to make sure that the logs directory exists
    if (!fs.existsSync('./logs')) {
        fs.mkdirSync('./logs');
    }
    let nextId = "" + (fs.readdirSync('./logs').length + 1);
    fs.mkdirSync(`./logs/${nextId}`)
    initialize(nextId);

    // If there is a prompt directory, we need to load it
    if (fs.existsSync('./prompts')) {
        loadPromptsFromDirectory('./prompts');
    }

    // If there is a workspace, we need to set it
    if (config.workspace) {
        setWorkspace(config.workspace);
    }
    if (config.resetWorkspace) {
        await resetWorkspace();
    }

    // We also should create instances of the models
    new Gpt4({
        apiKey: config.apiKey,
    })

}