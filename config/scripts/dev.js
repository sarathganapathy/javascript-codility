const { spawn } = require("child_process");

const options = {
    cwd: process.cwd()
};

// Front-end webpack server
const ps = spawn("node", ["config/scripts/start.js"], options);

ps.stdout.on("data", (data) => {
    console.log(data.toString());
});

ps.stderr.on("data", (data) => {
    console.log(`ps stderr: ${data}`);
});

// appServer server
const appServer = spawn("node", ["dist/server/app.js"], options);

appServer.stdout.on("data", (data) => {
    console.log(data.toString());
});

appServer.stderr.on("data", (data) => {
    console.log(`appServer stderr: ${data}`);
});

// js compiler server
const jsCompilerServer = spawn(
    "node", ["dist/js-compiler-server/app.js"],
    options
);

jsCompilerServer.stdout.on("data", (data) => {
    console.log(data.toString());
});

jsCompilerServer.stderr.on("data", (data) => {
    console.log(`jsCompilerServer stderr: ${data}`);
});