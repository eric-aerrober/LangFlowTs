/* 
    Global configuration file
*/

import { ChatModel } from "./Models";

export interface Config {

    // Secret key for OpenAI API
    openai_api_key: string

    // Default prompt store directory
    prompt_store_directory?: string

    // Default model to use
    default_model?: ChatModel

}

export const defaultConfig: Config = {
    openai_api_key: '',
}

export function updateConfig(newConfig: Partial<Config>) {
    Object.assign(defaultConfig, newConfig);
}
