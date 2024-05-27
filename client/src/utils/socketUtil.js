import io from 'socket.io-client';

const socketArr = {}; // 用于缓存 socket 

function Socket(nsp='/XJ',ip = '10.168.4.230') {
  // console.log('---------------Socket', ip);
  ip = JSON.stringify(ip);
  // console.log(socketArr[ip]);
  // 检查缓存中是否已存在相应的 socket
  if (!socketArr[ip]){
    socketArr[ip] = io(`${nsp}`, { reconnect: false, query: { ip }, transports: ['websocket'], upgrade: false });
  } 

  const socket = socketArr[ip];
  // console.log(socketArr[ip]);
  
  return socket
}

export default Socket;