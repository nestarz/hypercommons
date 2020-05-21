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
  // socket.pipe(process.stdout);
  // process.stdin.pipe(socket);
  // const local = new net.Socket().connect(8080);
  // socket.on("data", (data) => local.write(data));
  // local.on("data", console.log);
  // socket.pipe(local);

  socket.on("data", (message) => {
    console.log("---PROXY- got message", message.toString());

    let serviceSocket = new net.Socket();

    serviceSocket.connect(9200, "127.0.0.1", () => {
      console.log("---PROXY- Sending message to server");
      serviceSocket.write(message);
    });

    serviceSocket.on("data", (data) => {
      console.log("---PROXY- Receiving message from server", data.toString());
      socket.write(data);
    });
  });
});
