import express from 'express';
import * as Test from '../../tst/test';
import { exec } from 'child_process';
const app = express()
const port = 8080

// Cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// static files at /logs
app.use('/logs', express.static('logs'))

// invoke the agent
app.get('/test', (req, res) => {
  exec('npm run test');
})

// Clear out data
app.get('/clear', (req, res) => {
  exec('rm -r ./logs')
})

export function boot () {
  app.listen(port, () => {
    console.log(`Agent app listening on port ${port}`)
  })
}
