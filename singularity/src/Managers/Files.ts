import { exec } from 'child_process';
import * as fs from 'fs';
import { runBash } from './Bash';

let workspace: string | undefined = undefined ;

export function setWorkspace (newWorkspace: string) {
    workspace = newWorkspace;
}

export function getWorkspace () {
    if (workspace === undefined) {
        throw new Error('Workspace has not been set, denying access');
    }
    return workspace;
}

export async function resetWorkspace () {
    const path = getWorkspace();
    if (fs.existsSync(path)){
        await runBash(`rm -r ${path}`);
    }
    
    // Create the workspace
    await runBash(`mkdir ${path}`);

    // Initialize git
    await runBash(`cd ${path} && git init`)
    await runBash(`cd ${path} && echo "node_modules" >> .gitignore`)
}

export async function listFiles () {

    const path = getWorkspace();

    // Get all paths and subpaths in the workspace
    // Ignore node_modules, .git

    const files = await runBash(`cd ${path} && find . -type f -not -path "./node_modules/*" -not -path "./.git/*" -not -path "./coverage"`);
    const filesArray = files
        .split('\n')
        .filter((file) => file !== '')
        .map((file) => file.replace('./', ''));

    return filesArray;
}

export function readFile (file: string) {

    const path = getWorkspace();
    if (!fs.existsSync(`${path}/${file}`)) {
        return 'This file does not exist';
    }
    console.log('reading file', `${path}/${file}`);
    const data = fs.readFileSync(`${path}/${file}`, 'utf8');
    return data;
}

export function writeFile (file: string, data: string) {

    const path = getWorkspace();
    const fullPath = `${path}/${file}`;
    //recursively create the path
    const pathParts = fullPath.split('/');
    pathParts.pop();
    const pathToCreate = pathParts.join('/');
    if (!fs.existsSync(pathToCreate)) {
        fs.mkdirSync(pathToCreate, { recursive: true });
    }
    fs.writeFileSync(fullPath, data, 'utf8')

}