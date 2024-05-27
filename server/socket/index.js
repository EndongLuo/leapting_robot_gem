const IO = require('socket.io');

// const robotIO = require('./robot');
const XJ = require('./XJnsp');
const QS = require('./QSnsp');

function creatSocket(app) {
  const io = IO(app);

  XJ(io);
  QS(io);

}

module.exports = creatSocket