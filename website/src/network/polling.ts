import { DataObject, DataObjects } from "../state/dataObjects";
import { AgentRun, AgentRuns } from "../state/runs";

// Update state if needed
type setter = (runs: AgentRuns) => void;
type objectSetter = (object: DataObjects) => void;
let setterCallback: setter
let objectSetterCallback: objectSetter;

// Do polling on interval
let interval: number | null = null;

// Last update time, use to avoid duplicate updates
let lastUpdated: string = '';

// Data objects and their update times
let dataObjectTimes: { [key: string]: number } = {};
let dataObjectGlobal = {} as DataObjects;

// Let summary data exist
export interface summaryDataBase {
    calls: number,
    tokens: number,
    cachedCalls: number,
    start: number,
    end: number,
}
let summaryDataRecord: { [key: string]: summaryDataBase } = {};
export let getSummaryData = (runId: string) => summaryDataRecord[runId];

export function beginPolling (setAgentRuns: setter, setObject: objectSetter) {
    if (interval !== null) {
        throw new Error ('Polling already started');
    }
    //@ts-ignore
    interval = setInterval (doPolling, 1000)
    setterCallback = setAgentRuns;
    objectSetterCallback = setObject;
    doPolling ();
}

export function stopPoling () {
    if (interval === null) {
        throw new Error ('Polling not started');
    }
    clearInterval (interval);
    interval = null;
}

async function onDataChange (data: AgentRuns) {
    let runs = data.runs;
    
    let runIds = Object.keys (runs);
    for (let i = 0; i < runIds.length; i++) {
        let runId = runIds[i];

        let objects = Object.keys (runs[runId].data);
        for (let j = 0; j < objects.length; j++) {
            let objectKey = objects[j];
            let objectTime = runs[runId].data[objectKey]
            let saved = dataObjectTimes[objectKey];
            if (saved === undefined || saved !== objectTime) {
                saved = objectTime;
                requestObject (runId, objectKey);
            }
        }
    }
}

function newObject (run: string, old: DataObject, now: DataObject){

    let summaryData = summaryDataRecord[run];
    if (summaryData === undefined) {
        summaryData = {
            calls: 0,
            tokens: 0,
            cachedCalls: 0,
            start: -1,
            end: -1,
        }
        summaryDataRecord[run] = summaryData;
    }

    if (summaryData.start == -1  || now.timeline[0].time < summaryData.start) {
        summaryData.start = now.timeline[0].time;
    }
    if (summaryData.end == -1 || now.timeline[now.timeline.length - 1].time > summaryData.end) {
        summaryData.end = now.timeline[now.timeline.length - 1].time;
    }

    if (!now?.metadata?.modelQuery) {
        return;
    }

    const previousTokens = old?.metadata?.modelQuery?.tokenUsage;
    const nowTokens = now?.metadata?.modelQuery?.tokenUsage;
    const wasCached = now?.metadata?.cached;

    const delta = (nowTokens || 0) - (previousTokens || 0);
    if (!old){
        summaryData.calls += 1;
        summaryData.cachedCalls += wasCached ? 1 : 0;
    }
    summaryData.tokens += delta;
    
}

async function requestObject (run: string, id: string) {
    fetch (`http://localhost:8080/logs/${run}/${id}.json`)
        .then (response => response.json ())
        .then (json => {

            newObject (run, dataObjectGlobal[id], json);

            dataObjectGlobal = {
                ...dataObjectGlobal,
                [id]: json
            }
            objectSetterCallback (dataObjectGlobal);
            
        })
        .catch (error => {
            throw new Error ('Error polling: ' + error);
        });

}

function doPolling () {
    fetch ('http://localhost:8080/logs/index.json')
        .then (response => response.json ())
        .then (json => {
            if (json.lastUpdated !== lastUpdated) {
                lastUpdated = json.lastUpdated;
                onDataChange (json);
                setterCallback (json);
            }
        })
        .catch (error => {
            throw new Error ('Error polling: ' + error);
        });
}
