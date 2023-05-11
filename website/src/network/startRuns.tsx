export function startRun () {
    fetch (`http://localhost:8080/test`)
}

export function clearRuns () {
    fetch (`http://localhost:8080/clear`)
}