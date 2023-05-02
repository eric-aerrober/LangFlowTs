import { subscribe, EventBusEvent } from "./EventBus"

interface LoggerConfig {
    writeToConsole: boolean,
    subscribe: string
}

const startTime: Date = new Date()
const config: LoggerConfig = {
    writeToConsole: false,
    subscribe: 'log'
}

export function setLoggerConfig(configPartial: Partial<LoggerConfig>) {
    Object.assign(config, configPartial)
    subscribe(config.subscribe, (event: EventBusEvent) => logEvent(event))    
}

function logEvent(event: EventBusEvent) {

    const prefix = event.eventType
    const time = getTimeString()
    const logData = `[${time}] ${prefix}: ${event.message}`

    if (config.writeToConsole) {
        toConsole(event, logData)
    }

}

function getTimeString() {
    const now = new Date()
    const diff = now.getTime() - startTime.getTime()
    const minutes = Math.floor(diff / 1000 / 60)
    const minStr = minutes.toString().padStart(2, '0')
    const seconds = Math.floor(diff / 1000) - minutes * 60
    const secStr = seconds.toString().padStart(2, '0')
    const milliseconds = diff - seconds * 1000 - minutes * 60 * 1000
    const msStr = milliseconds.toString().padStart(3, '0')
    return `${minStr}:${secStr}.${msStr}`
}
        
function toConsole(event: EventBusEvent, logData: string) {
    console.log(logData)
}