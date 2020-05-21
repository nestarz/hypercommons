import hyperswarm from "hyperswarm";
import crypto from "crypto";
import net from "net";

import http from "http";

const swarm = hyperswarm();
const topic = crypto
  .createHash("sha256")
  .update("my-hyperswarm-topic-lol")
  .digest();

swarm.join(topic, {
  lookup: true,
  announce: true,
});

http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello World\n");
  })
  .listen(9200);

swarm.on("connection", (socket, details) => {
  socket.on("data", (message) => {
    const service = new net.Socket();
    service.connect(9200, "127.0.0.1", () => service.write(message));
    service.on("data", (data) => socket.write(data));
  });
});
