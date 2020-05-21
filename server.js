import servor from "servor";
import httpProxy from "http-proxy";

servor({
  root: ".",
  fallback: "index.html",
  module: false,
  static: false,
  reload: false,
  inject: "",
  port: 8080,
}).then((instance) => {
  swarm.on("connection", (socket, details) => {
    httpProxy.createProxyServer({ target: socket }).listen(8000);
  });
});
