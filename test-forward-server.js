import http from "http";
import net from "net";

import hyperswarm from "hyperswarm";
import crypto from "crypto";
import pump from "pump";

const swarm = hyperswarm();
const topic = crypto
  .createHash("sha256")
  .update("my-hyperswarm-topic")
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
  .listen(5000);

swarm.on("connection", (socket, details) => {
  const httpClient = net.createConnection(5000, "127.0.0.1");
  pump(httpClient, socket, httpClient, console.log);
});
