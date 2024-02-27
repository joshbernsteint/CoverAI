const children = require('child_process');


async function main(){
    const process = children.spawn("npm run build", {shell: true});
    console.log("Starting build");
    process.stderr.on('data', d => {
        console.log(d.toString());
    });
    process.on('close', () => {
        console.log("Build completed");
    })
}

main();

