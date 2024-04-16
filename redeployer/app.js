import express from 'express';
import { config } from 'dotenv';
import { spawn, spawnSync } from 'child_process';

config();
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());


/**
 * Repulls from GitHub
 * @returns `true` if the local repo was updatd. `false` if not.
 */
function rePull(){
    const pullFromGitHub = spawnSync('git pull | tail -1', {shell: true});
    const stdout = pullFromGitHub.stdout.toString();
    return stdout !== "Already up to date.\n"
}

let activeTimeout = undefined;
const DELAY = 5000;

app.get('/', async (req,res) => {
    res.send("Ping route!");
});

app.post('/github', async (req,res) => {
    if(activeTimeout){
        res.send("In Timeout, Please try again later.");
    }
    else if(rePull()){
        //Restart the servers
        spawnSync('pkill screen', {shell: true});
        spawnSync('cd ../ && npm start', {shell: true});

        res.send("Server Reloading!");
        activeTimeout = setTimeout(() => {activeTimeout = undefined}, DELAY);
    }
});

app.listen(PORT, () => {
    console.log("Server Online!");
});