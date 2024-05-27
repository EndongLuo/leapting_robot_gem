const Koa = require("koa");
const { createServer } = require("http");
const { Server } = require("socket.io");


module.exports = function() {
  return async function(ctx, next) {
      socket1(ctx);
      await next(); //运行完毕，交给下一个中间件
  };
};

function socket1(ctx) {

  const app = new Koa();
  const httpServer = createServer(app.callback());
  const io = new Server(httpServer, { /* options */ });

  io.on("connection", (socket) => {
    // ...
    console.log(socket.id);
  });

  // httpServer.listen(5000);
  // global.console.log('test middleware',ctx);
}
