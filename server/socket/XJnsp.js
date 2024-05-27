const { robotSocket } = require('./robotSocket');


async function XJNamespace(io) {
  const nspXJ = io.of('/XJ');
  // console.log('---------------nspXJ');

  nspXJ.on('connection', (socket) => {
    let robot = null;
    const ip = socket.handshake.query.ip || ['10.168.4.220'];
    console.log('ip',ip);

    if (!ip) return;
    const robotIPs = JSON.parse(ip);

    if (!Array.isArray(robotIPs)) {
      console.log(`${socket.id}: ${robotIPs} in XJ`);
      robot = robotSocket(robotIPs, socket);
    }
    else {
      // 加入房间
      robotIPs.map((robotIP) => {
        console.log(`${socket.id}: ${robotIP} in XJs`);

        robot = robotSocket(robotIP, socket);
      });
    }


    // 断开连接处理
    socket.on('disconnect', () => {
      console.log('disconnect');
      // robot.Close();
      // socket.removeAllListeners([navPath]);

    });
    return robot
  });
}

module.exports = XJNamespace;
