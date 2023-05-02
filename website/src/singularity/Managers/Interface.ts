export async function tryLoadFromCache (id: string) {
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:8080/cache/${id}`)
            .then(res => res.json())
            .then(json => resolve(json))
            .catch(err => resolve(null))
    })
}

export async function saveToCache (id: string, data: any) {
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:8080/cache/${id}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => resolve(res))
    })
}

export async function loadPrompt (id: string) {
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:8080/prompts/${id}`)
            .then(data => {
                if (data.status === 404) {
                    resolve(null);
                }
                else {
                    resolve(data.text());
                }
            })
    })
}

export async function resetWorkspace () {
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:8080/workspace/reset`)
            .then(res => resolve(res))
    })
}

export async function getWorkspace () : Promise<string>{
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:8080/workspace`)
            .then(res => resolve(res.text()))
            .catch(err => resolve('This directory is empty'))
    })
}

export async function getWorkspaceFile (path: string): Promise<string>{
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:8080/workspace/${path}`)
            .then(res => resolve(res.text()))
            .catch(err => resolve(''))
    })
}

export async function saveWorkspaceFile (path: string, data: any) {
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:8080/workspace/file`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: data,
                file: path
            })
        })
            .then(res => resolve(res))
    })
}

export async function npmTest (): Promise<string>{
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:8080/bash/npm-test`)
            .then(res => resolve(res.text()))
    })
}

export async function npmInstall (params: string): Promise<string>{
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:8080/bash/npm-install`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({params})
        })
            .then(res => resolve(res.text()))
    })
}

export async function gitDiff (): Promise<string>{
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:8080/git/diff`)
            .then(res => resolve(res.text()))
    })
}

export async function gitCommit (message: string): Promise<string>{
    //sanatize message, remove all non-alphanumeric characters and lowercase
    message = message.replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase();
    // limit message to 50 characters
    message = message.substring(0, 50);
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:8080/git/commit`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({message})
        })
            .then(res => resolve(res.text()))
    })
}