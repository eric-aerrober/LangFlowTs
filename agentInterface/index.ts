import express from 'express';
import fs from 'fs';
import { exec } from 'child_process';
const app = express()
const port = 8080

app.use((req, res, next) => {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).send();
    }
    else {
        next();
    }
});

app.use(express.raw({type: 'application/json'}));

async function runBash(command: string) : Promise<string> {

    let lines = '';
    
    const val = exec('cd ../workspace && npm run test', (err, stdout, stderr) => {
        if (stderr) {
            lines += stderr + '\n';
        }
        else {
            lines += stdout + '\n';
        }
    });

    return new Promise((resolve, reject) => {
        val.on('exit', (code) => {
            setTimeout(() => {
                resolve(lines);
            }, 10)
        });
    })
    
}

app.get('/cache/:id', (req, res) => {
    const id = req.params.id;
    console.log('GET /cache/:id', id);
    const path = `./cache/${id}.json`;
    if (fs.existsSync(path)) {
        const data = fs.readFileSync(path)
        res.send(data);
    }
    else {
        res.status(404).send('Not found');
    }
})

app.post('/cache/:id', (req, res) => {
    const id = req.params.id;
    console.log('POST /cache/:id', id);
    const path = `./cache/${id}.json`;
    const data = JSON.parse(req.body)
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    res.send('OK');
})

app.get('/prompts/:id', (req, res) => {
    const id = req.params.id;
    console.log('GET /prompts/:id', id);
    const path = `./prompts/${id}`;
    if (fs.existsSync(path)) {
        const data = fs.readFileSync(path)
        res.send(data);
    }
    else {
        res.status(404).send('Not found');
    }
})

app.get('/workspace/reset', (req, res) => {
    console.log('GET /workspace/reset');
    const path = `../workspace`;
    if (fs.existsSync(path)) {
        fs.rmdirSync(path, {recursive: true});
    }
    fs.mkdirSync(path);
    exec('cd ../workspace && echo node_modules > .gitignore && git init', (err, stdout, stderr) => {
        if (err) {
            res.send('OK');
        }
        else {
            res.send(stdout);
        }
    });


})

app.get('/workspace', (req, res) => {
    console.log('GET /workspace/list');
    const path = `../workspace`;
    const files = fs.readdirSync(path);
    if (files.length === 0) {
        res.send('This directory is empty');
        return;
    }
    res.send(files.join('\n'));
})

app.get('/workspace/:id', (req, res) => {
    const id = req.params.id;
    console.log('GET /workspace/:id', id);
    const path = `../workspace/${id}`;
    if (fs.existsSync(path)) {
        const raw = fs.readFileSync(path)
        res.send(raw);
    }
    else {
        res.status(404).send('Not found');
    }
})

app.post('/workspace/:id', (req, res) => {
    const id = req.params.id;
    console.log('PUT /workspace/:id', id);
    const data = JSON.parse(req.body)
    const file = data.file;
    const path = `../workspace/${file}`;
    const directories = file.split('/').slice(0, -1);
    fs.mkdirSync(`../workspace/${directories.join('/')}`, {recursive: true});
    fs.writeFileSync(path, data.content);
    res.send('OK');
})

app.get('/bash/npm-test', async (req, res) => {
    console.log('GET /bash/npm-test');
    const result = await runBash('npm run test');
    const formatted = result
        .replace(/A complete log of this run can be found in:.*/g, '')
        .replace(/\/Users\/eric.*/g, '');

    res.send(formatted);
})

app.post('/bash/npm-install', (req, res) => {
    console.log('GET /bash/npm-install');
    const data = JSON.parse(req.body)
    exec(`cd ../workspace && npm install ${data.params}`, (err, stdout, stderr) => {
        //remove 'in 327ms' from messages
        if (err) {
            stderr = stderr.replace(/in \d+.*\n/g, '\n');
            res.send(stderr);
        }
        else {
            stdout = stdout.replace(/in \d+.*\n/g, '\n');
            res.send(stdout);
        }
    });
})

app.post('/git/commit', (req, res) => {
    const data = JSON.parse(req.body)
    const msg = data.message;
    exec('cd ../workspace && git add . && git commit -m "' + msg + '"', (err, stdout, stderr) => {
        if (err) {
            res.send(stderr);
        }
        else {
            res.send(stdout);
        }
    });
})

app.get('/git/diff', (req, res) => {
    console.log('GET /git/diff');
    exec('cd ../workspace && git status', (err, stdout, stderr) => {
        if (err) {
            res.send(stderr);
        }
        else {
            res.send(stdout);
        }
    });
})

app.listen(port, () => {
  console.log(`Agent app listening on port ${port}`)
})
