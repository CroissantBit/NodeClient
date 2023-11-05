const WebSocket = require("ws");
const server = new WebSocket.Server({
  port: 8080,
});
server.binaryType = "arraybuffer";

server.on("connection", (ws) => {
  console.log("Client connected");
  ws.on("message", (message) => {
    console.log("Received:", message);
    console.log(Date.now() + " Got Ping request");
    ws.send(new Uint8Array([0]));
  });
  ws.send(new Uint8Array([1]));
});
