import http from "http";
import httpProxy from "http-proxy";

swarm.on("connection", (socket) => {
  httpProxy
    .createProxyServer({ target: "http://localhost:9000" })
    .listen(socket);
});

http
  .createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/plain" });
    const headers = JSON.stringify(req.headers, true, 2);
    res.write(`request successfully proxied! ${headers}`);
    res.end();
  })
  .listen(9000);
