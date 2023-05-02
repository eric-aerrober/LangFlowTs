import { PromptStore, Models, Logging, EventBus } from "."
import { clear } from "../state/manual/nodeNetwork"
import { onEvent } from "../state/manual/nodeNetwork.consumer"
import { apiKey } from "./key"

export function runStartup () {

    // Build model 
    new Models.Gpt4({ 
        name: 'GPT-4 Chat',
        // OPENAI GPT-4 API KEY
        apiKey: apiKey,
        cacheConfig: {
            cacheDirectory: './cache'
        }
    })

    // Set logger
    Logging.setLoggerConfig({
        writeToConsole: true,
        subscribe: 'log'
    })

    // Listen for nodes
    EventBus.subscribe('*', (_:any) => onEvent(_))

    // Clear map
    clear()


    console.log("Startup squence complete")



}
