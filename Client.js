const grpc = require('grpc')
const protoloader = require("@grpc/proto-loader")
const packageDef = protoloader.loadSync("resources/gRPC.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const dataStreamPackage = grpcObject.dataStreamPackage
const readline = require('readline')
const sockets = [];

const client = new dataStreamPackage.DataStream("localhost:40000", grpc.credentials.createInsecure());

const call = client.layline();
call.on("data", data => {
    console.log("Received " + JSON.stringify(data))
})

call.on("end", e => console.log("server done!"))