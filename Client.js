const express = require("express");
const app = express();
const ws = require('ws');
const grpc = require('grpc');
const protoloader = require("@grpc/proto-loader");
const packageDef = protoloader.loadSync("resources/gRPC.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const dataStreamPackage = grpcObject.dataStreamPackage;
const readline = require('readline');
const sockets = [];
var btc = []

const client = new dataStreamPackage.DataStream("localhost:40000", grpc.credentials.createInsecure());

const call = client.layline();
call.on("data", data => {
  var splitando = data.line.split(',')
  sockets.forEach(socket => socket.send(splitando[3]+':'+splitando[5]));
    console.log(splitando[3]+': '+splitando[5])
    
})

call.on("end", e => console.log("server done!"))




// '2018-12-01 00:00:33.456000089+00:00', ->> data
// 'huobi', ->> corretora
// '4.1224',   ->> valor da moeda virtual
// '16677.525', ->> valor em dolares
// 'long', ->> deal type
// 'btc', ->> moeda
// 'usd' ->> dolar

// Set up a headless websocket server that prints any
// events that come in.
const wsServer = new ws.Server({ noServer: true });
wsServer.on('connection', socket => {
  socket.on('message', message => console.log(message)); // guardar o socket em sockets [] // itera no array de sockets na linha 17 para enviar para o html - socket.send 
  
  sockets.push(socket)
  console.log("Conectado")
});

const server = app.listen(3001, () => {
    console.log("hi")
});

app.get("/", function(req, res) {
    res.sendFile(__dirname + "\\resources\\grafico\\index.html");
});



server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
      wsServer.emit('connection', socket, request);
    });
  });
