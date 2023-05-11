import { existsSync, readFileSync, writeFileSync } from 'fs'
import {ActionContext} from './ActionContext'
import { uuid } from './Ids'

let runId : string

export function initialize(id: string) { 
    runId = id 
}

export function RecordActionContext(context: ActionContext) {
    if (!context) return
    const path = `./logs/${runId}/${context.id}.json`
    const data = JSON.stringify(context, null, 4)
    writeFileSync(path, data)
    UpdateIndex(context.id, context.id)
}

export function UpdateIndex(id: string, initiatorId: string) {
    const index = existsSync(`./logs/index.json`)
        ? readFileSync(`./logs/index.json`, 'utf8')
        : '{"runs": {}}'
    const data = JSON.parse(index)
    if (!data.runs[runId]){
        data.runs[runId] = {
            id: uuid(),
            timestamp: Date.now(),
            root: initiatorId,
            data: {}
        }
    }
    data.runs[runId].data[id] = Date.now();
    data.lastUpdated = Date.now();
    writeFileSync(`./logs/index.json`, JSON.stringify(data, null, 4))
}