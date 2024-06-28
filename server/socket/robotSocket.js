const { updateTaskInfo } = require('../models/task');
const Robot = require('./ros/Robot');
const robotArr = {}; // 用于缓存 Robot 实例
let oldState = {};

function robotSocket(ip, socket) {
  // 检查缓存中是否已存在相应的 Robot 实例
  if (!robotArr[ip]) robotArr[ip] = new Robot(ip);

  const robot = robotArr[ip];
  // ----------------------------- 发 布 消 息 （publish） -------------------------------------------

  // 控制
  socket.on('control', (ip, axes, buttons, frame_id) => {
    // console.log('control', axes, buttons);
    robotArr[ip].control(axes, buttons, frame_id);
  })

  // 导航
  socket.on('sendNav', (ip, data) => {
    console.log('sendNav', data);
    robotArr[ip].sendNav(data);
  })

  // 取消导航
  socket.on('cancelNav', (ip) => {
    console.log('cancelNav');
    robotArr[ip].cancelNav();
  })

  // 发送任务
  socket.on('sendTask', (ip, d) => {
    console.log('sendTask', d.id);
    robotArr[ip].sendTask(d);
  })

  // 重定位
  socket.on('initPose', (ip, poses) => {
    robotArr[ip].initPose(poses);
  })

  // 重启工控机
  socket.on('reboot', (ip) => {
    robotArr[ip].reboot();
  })

  // // 关闭连接
  // socket.on('close', () => {
  //   robot.Close();
  // })
  // ----------------------------- 订 阅 消 息 （subscribe） -------------------------------------------

  // 机器人连接
  setInterval(() => {
    socket.emit('rosConnect', ip, robot.rosConnect);
  }, 1000);

  // 机器人姿态
  robot.robotPose(msg => socket.emit('robotPose', ip, msg));

  // 任务状态
  robot.taskState(async msg => {
    socket.emit('taskState', ip, msg)
    if (!oldState[ip])  oldState[ip]= {state:'',id:0,start_time:'',task_odom:0}
    // console.log('1',msg.id ,oldState[ip].id,msg.task_type == oldState[ip].state);
    if (msg.task_type !== oldState[ip].state) {
    // console.log('2',msg.id ,oldState[ip]);

      if (msg.id == 0) {
        msg.id =oldState[ip].id;
        msg.start_time = oldState[ip].start_time;
        msg.task_odom = oldState[ip].task_odom;
        msg.progress = 0;
      } else{
        oldState[ip].state = msg.task_type;
        oldState[ip].id = msg.id;
        oldState[ip].start_time=msg.start_time;
        oldState[ip].task_odom =msg.task_odom;
        msg.progress = (msg.done_nodes.length/msg.task_nodes.length).toFixed(2)*100 || 0;
      }
      try {
        var res = await updateTaskInfo(msg);
        if (res[0])  console.log('taskState updated', ip, res);
        oldState[ip].state = msg.task_type;
        // console.log('oldState[ip].id',oldState[ip].id);
      } catch (error) {
        console.error('Failed to update task info:', error);
      }
    }
    
    // socket.emit('taskState', ip, msg)
    // if (!oldState[ip])  oldState[ip]= {state:''}
    // if (msg.task_type !== oldState[ip].state) {
    //   oldState[ip].state = msg.task_type;
    //   msg.progress = (msg.done_nodes.length/msg.task_nodes.length).toFixed(2)*100 || 0;

    //   try {
    //     var res = await updateTaskInfo(msg);
    //     if (res[0])  console.log('taskState updated', ip, res);
    //   } catch (error) {
    //     console.error('Failed to update task info:', error);
    //   }
    // }
  })

  // 处理电量、速度
  robot.bunkerStatus(msg => socket.emit('bunkerStatus', ip, msg.battery_voltage, msg.linear_velocity, msg.base_state));

  // 导航路径
  robot.navPath(msg => socket.emit('navPath', ip, msg));

  // 导航结束
  robot.navEnd(msg => socket.emit('navEnd', ip, msg))

  // 诊断，告警
  robot.diagnostic(msg => {
    const targetSet = new Set(["/Devices", "/NetWork", "/STATUS", "/DEVICES", "/SYSTEM"]);
    const statusMap = { "Stale": 3, "Error": 2, "Warning": 1, "OK": 0 };
    var status = 0;
    const list = [];

    msg.status.forEach(item => {
      if (targetSet.has(item.name)) {
        const processedValues = item.values.map(valueItem => {
          const mapValue = statusMap[valueItem.value] ?? -1;
          status = Math.max(status, mapValue);
          return { ...valueItem, value: mapValue };
        });
        list.push(...processedValues);
      }
    });
    socket.emit('diagnostic', ip, { status, list });
  });

  // 点云
  robot.scanPoints(msg => socket.emit('scanPoints', ip, msg));

  // 立柱地图
  robot.pillarMap(msg => socket.emit('pillarMap', ip, msg)) 
  // --------------------------------------------------------

  return robot; // 返回 robot 实例
};

module.exports = { robotSocket, robotArr };