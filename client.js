import hyperswarm from "hyperswarm";
import crypto from "crypto";

const swarm = hyperswarm();
const topic = crypto
  .createHash("sha256")
  .update("my-hyperswarm-topic-lol")
  .digest();

swarm.join(topic, {
  lookup: true,
  announce: true,
});

swarm.on("connection", (socket, details) => {
  if (!details.peer) return;
  console.log(`http://${socket.remoteAddress}:${socket.remotePort}`)
});

swarm.on("disconnection", (socket, details) => {
  console.log("disconnection");
});
