import http from "http";
import net from "net";

import hyperswarm from "hyperswarm";
import crypto from "crypto";

const swarm = hyperswarm();
const topic = crypto
  .createHash("sha256")
  .update("my-hyperswarm-topic")
  .digest();

swarm.join(topic, {
  lookup: true,
  announce: true,
});

swarm.on("connection", (socket, details) => {
  if (!details.peer) return;
  console.log(socket.localAddress, socket.localPort)
  http
    .createServer((req, res) => {
      const proxy = http.request(
        {
          hostname: socket.localAddress,
          port: socket.localPort,
          path: req.url,
          method: req.method,
          headers: req.headers,
        },
        (pres) => {
          res.writeHead(pres.statusCode, pres.headers);
          pres.pipe(res);
        }
      );
      req.pipe(proxy);
    })
    .listen(8081, "127.0.0.1");
});
