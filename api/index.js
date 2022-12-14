/*
	1. npm install express
	2. npm install cors
	3. npm install ws
	4. npm install nodemon
*/
const express = require("express");
const app = express();
const http = require("http");
const WebSocket = require("ws");
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message, isBinary) {
    console.log(message.toString(), isBinary);
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });
  ws.send('Socket Connected');
});
app.get("/", (req, res) => {
  res.send("Hello World!");
});
server.listen(process.env.PORT || 5000, () => {
  console.log("Listening to port http://localhost:5000");
});