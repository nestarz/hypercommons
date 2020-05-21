import http from "http";
import net from "net";
import pump from "pump";

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
  socket.on("data", console.log)
});
