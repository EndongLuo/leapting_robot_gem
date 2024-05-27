const robotSocket = require('./robotSocket');

async function QSNamespace(io) {
  const nspXJ = io.of('/QS');
  // console.log('---------------nspQS');

  nspXJ.on('connection', (socket) => {
    const ip = socket.handshake.query.ip || '10.168.4.220';
    
    if (!ip) return;
    const robotIPs = JSON.parse(ip);

    if (!Array.isArray(robotIPs)) {
      console.log(`${socket.id}: ${robotIPs} in QS`);
      var robot = robotSocket(robotIPs, socket);
    }
    else {
      // 加入房间
      robotIPs.map((robotIP) => {
        console.log(`${socket.id}: ${robotIP} in QS`);

        robotSocket(robotIP, socket);
      });
    }

    // 断开连接处理
    socket.on('disconnect', () => {
      console.log('disconnect');
      // robot.Close();
    });

  });
}

module.exports = QSNamespace;
