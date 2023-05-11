import { exec } from "child_process";
import { getWorkspace } from "./Files";

export async function runBash(command: string, sanatize?: boolean) : Promise<string> {

    let lines = '';
    const commandScoped = `${command}`;
    console.log(`Running: ${commandScoped}`);
    
    const val = exec(commandScoped, (err, stdout, stderr) => {
        if (stderr) {
            lines += stderr + '\n';
        }
        else {
            lines += stdout + '\n';
        }

        if (sanatize) {
            // Sanatize, remove 'in 816ms' like strings
            const regex = /in \d+.*\n/g;
            lines = lines.replace(regex, '\n');
            lines = lines.split('can be found in')[0]
            const regex2 = /Time: .*\n/g;
            lines = lines.replace(regex2, '\n');
        }

    });

    return new Promise((resolve, reject) => {
        val.on('exit', (code) => {
            setTimeout(() => {
                console.log('Done running bash command');
                console.log(lines);
                resolve(lines);
            }, 10)
        });
    })
    
}
