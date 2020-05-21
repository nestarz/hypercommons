import hyperswarm from "hyperswarm";
import crypto from "crypto";
import http from "http";
import net from "net";

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
  //console.log(socket.remoteAddress, socket.remotePort, details.peer);

  console.log(`http://${socket.remoteAddress}:${socket.remotePort}`)
  socket.on("data", (message) => {
    console.log("---PROXY- got message", message.toString());

    let serviceSocket = new net.Socket();

    serviceSocket.connect(socket.remotePort, socket.remoteAddress, () => {
      console.log("---PROXY- Sending message to server");
      serviceSocket.write(message);
    });

    serviceSocket.on("data", (data) => {
      console.log("---PROXY- Receiving message from server", data.toString());
      socket.write(data);
    });
  });

});

swarm.on("disconnection", (socket, details) => {
  console.log("disconnection");
});
