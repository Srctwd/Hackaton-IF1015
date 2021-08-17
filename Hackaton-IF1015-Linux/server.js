const fs = require('fs');
const readline = require('readline');
const express = require('express');
const tradesPath = __dirname + '/resources/trades/'.toString()
const app = express();
var streamLine = []

const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("resources/gRPC.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const dataStreamPackage = grpcObject.dataStreamPackage;

const server = new grpc.Server();
server.bind("0.0.0.0:40000", grpc.ServerCredentials.createInsecure());
server.addService(dataStreamPackage.DataStream.service, {
    "layline": layline
});
server.start();



function layline(call, callback) {
    streamLine.forEach(line => call.write({ "line": line }));
    call.end();
}


async function readfunction() {
    const files = await fs.promises.readdir(__dirname + '/resources/trades/')
    for await (const file of files) {
        await processLineByLine(tradesPath + file, (line, eof) => {})
    }
}

async function processLineByLine(partsFile, action) {
    const fileStream = fs.createReadStream(partsFile);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.

    for await (const line of rl) {
        // Each line in' input.txt will be successively available here as `line`.
        action(line, false)
            //console.log(`Line from file: ${line}`);
        streamLine.push(line)
    }
    action('', true)


}

readfunction();
//processLineByLine();