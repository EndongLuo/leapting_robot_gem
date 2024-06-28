import Vue from 'vue';
import Socket from '@/utils/socketUtil';
import { getRobot, getRobots } from '@/api/robot'
let rePose = { '10.168.4.230': [] }, reNavPath = {};


const state = {
  socket: null,
  ips: ['10.168.4.230'],
  // nowIP: '192.168.12.230',
  nowIP: localStorage.getItem('nowIP') || '192.168.20.123',
  taskState: {},
  siteId: localStorage.getItem('siteId') || "24",
  Robot: {},
  Robots: [],
  totalJson: null,
  blockNames: '4S',
  P: null,
  offset: { x: 0, y: 0 },
}

const mutations = {
  // SET_MARKER(state, { c, r }) {
  //   console.log(c, r);
  //   const yaw = (state.Robot[state.nowIP].markerOp.rotationAngle - r) * Math.PI / 180;

  //   let [x1, y1] = state.Robot[state.nowIP].robotPose;
  //   let [x2, y2] = c;

  //   // Calculate the differences in coordinates
  //   let dx = x2 - x1;
  //   let dy = y2 - y1;

  //   // Calculate the offset considering the yaw angle
  //   let offsetX = dx * Math.cos(yaw) - dy * Math.sin(yaw);
  //   let offsetY = dx * Math.sin(yaw) + dy * Math.cos(yaw);

  //   // Return the offset as an object
  //   state.offset = { x: offsetX, y: offsetY };

  //   // state.offset = {
  //   //   x: (state.Robot[state.nowIP].robotPose[1] - c[1]) / 2,
  //   //   y: (state.Robot[state.nowIP].robotPose[0] - c[0]) / 2,
  //   // };
  // },
  SET_MARKER(state, { c, r }) {
    console.log( state.Robot[state.nowIP].robotPose, state.Robot[state.nowIP].markerOp.rotationAngle, c, r);
    const yaw =(r- state.Robot[state.nowIP].markerOp.rotationAngle) * Math.PI / 180;

    state.offset = {
      x: (state.Robot[state.nowIP].robotPose[1] - c[1]) / 2,
      y: (state.Robot[state.nowIP].robotPose[0] - c[0]) / 2,
    };
  },
  CLOSE_MARKER(state) {
    state.offset = { x: 0, y: 0 };
  },
  SET_NOWIP(state, ip) {
    state.nowIP = ip;
  },
  SET_SOCKET(state, socket) {
    state.socket = socket
  },
  SET_TOTALJSON(state, { totalJson, P }) {
    state.totalJson = totalJson
    state.P = P
  },

  SET_ROBOT(state, ip) {
    state.Robot[ip] = Vue.observable({
      rosConnect: false,
      taskStatus: false,
      taskState: {},
      bunkerStatus: {
        battery: 0,
        speed: 0,
        charge: 2
      },
      robotPose: [-1000, -1000],
      markerOp: {
        rotationAngle: 0
      },
      navPath: [],
      diagnostic: {},
    })
  },

  setRobotPose(state, { ip, d }) {
    if (state.nowIP === ip) {
      // console.log('setRobotPose', ip, d);

      const point = [d.position.x, d.position.y]
      if (!state.totalJson) return;
      const fences = state.totalJson.features.map(i => ({
        coordinates: i.geometry.coordinates[0],
        PVMID: i.properties.PVMID
      }));
      // console.log(fences);
      const PVMID = findPVMIDForPoint(point, fences);
      // console.log('setRobotPose',  PVMID);
      state.blockNames = PVMID;
      localStorage.setItem('changeBlock', PVMID);
    }
    if (!d.position.length) Vue.set(state.Robot[ip], 'robotPose', [-1000, -1000]);
    Vue.set(state.Robot[ip], 'robotPose', [d.position.y, d.position.x]);
    Vue.set(state.Robot[ip].markerOp, 'rotationAngle', d.orientation);
    rePose[ip] = [d.position.y, d.position.x] || [-1000, -1000];

  },

  setRobotBattery(state, { ip, bunkerStatus }) {
    Vue.set(state.Robot[ip], 'bunkerStatus', bunkerStatus);
  },

  setNavPath(state, { ip, d }) {
    var navPath = d.map(i => [i.pose.position.y, i.pose.position.x]);
    Vue.set(state.Robot[ip], 'navPath', navPath);
    reNavPath[ip] = d.map(i => [i.pose.position.y, i.pose.position.x])
  },

  setTaskState(state, { ip, d }) {
    if (ip === state.nowIP) {
      d.progress = ((d.done_nodes.length / d.task_nodes.length) * 100).toFixed(1);
      // Vue.set(state.Robot[ip], 'taskState', {...d,done_nodes:[],task_nodes:[] });
      state.Robot[ip].taskState = { ...d, done_nodes: [], task_nodes: [] };
      var a = { ...d }
      const appendIndices = k => Array.from({ length: state.P }, (_, i) => k + '_' + (i + 1));

      a.task_nodes = a.task_nodes.flatMap(appendIndices);
      a.done_nodes = a.done_nodes.flatMap(appendIndices);
      state.taskState = a;
    }
    // console.log('setTaskState',d.task_nodes.length, a.task_nodes.length);

    if (d.task_type === 1 || d.task_type === 2) state.Robot[ip].taskStatus = true;
    else state.Robot[ip].taskStatus = false;
  }
}

const actions = {
  async getRobot({ commit, state }, siteId) {
    // console.log('getRobot', siteId,state.siteId);
    if (siteId) state.siteId = siteId
    const { data } = await getRobot(state.siteId);
    // console.log(1);// 打印了2次
    var res = await getRobots(state.siteId);
    // console.log(res);
    state.Robots = data;

    state.ips = data.map((item) => {
      commit('SET_ROBOT', item.ip);
      return item.ip;
    })
    Vue.set(state, 'ips', state.ips);
  },
  async init({ commit, dispatch, state }) {
    console.log('init');
    await dispatch('getRobot')

    const socket = await Socket('/XJ', state.ips);
    // console.log('socket', socket.id);

    socket.on('connect', () => {
      console.log('Connected to server');
      commit('SET_SOCKET', socket);
    });

    socket.on('disconnect', () => {
      console.log('Disconnect');
      socket.off('navPath');
    });

    // 机器人连接
    socket.on('rosConnect', (ip, d) => {
      // console.log('rosConnect',ip, d);

      state.Robot[ip].rosConnect = d;
      // if (!d) state.Robot[ip].robotPose = [-1000, -1000];
      // else {
      //   state.Robot[ip].navPath = reNavPath[ip];
      //   state.Robot[ip].robotPose = rePose[ip];
      // }
    })

    // 任务状态
    socket.on('taskState', (ip, d) => {
      // console.log('taskState', d)
      commit('setTaskState', { ip, d });
    })

    // 处理电量、速度
    socket.on('bunkerStatus', (ip, d, v, charge) => {
      var bunkerStatus = { battery: parseInt(d), speed: v.toFixed(1), charge } || {};
      // console.log('bunkerStatus', ip, d, v, charge);
      commit('setRobotBattery', { ip, bunkerStatus });
    })

    // 机器人姿态
    socket.on('robotPose', (ip, d) => {
      // console.log('robotPose',ip, d)
      commit('setRobotPose', { ip, d });
    })

    // 导航路径
    socket.on('navPath', (ip, d) => {
      // console.log('store navPath', d.length)
      commit('setNavPath', { ip, d });
    })

    // 导航结束
    socket.on('navEnd', (ip, d) => {
      console.log('store navEnd', d);
      if (d) {
        state.Robot[ip].navPath = [];
        reNavPath[ip] = [];
      }
    })

    // 诊断，告警
    socket.on('diagnostic', (ip, d) => {
      // console.log('store diagnostic', d);
      state.Robot[ip].diagnostic = d;
    })

    // 点云
    socket.on('scanPoints', (ip, d) => {
      // const cosYaw = Math.cos(state.offset.yaw);
      // const sinYaw = Math.sin(state.offset.yaw);
      // d.forEach(i => {
      //   i.x = i.x * cosYaw - i.y * sinYaw + state.offset.x;
      //   i.y = i.x * sinYaw + i.y * cosYaw + state.offset.y;
      // });
      d.forEach(i => {
        i.x -= state.offset.x;
        i.y -= state.offset.y;
      });
      if (state.nowIP == ip) {
        state.Robot[ip].scanPoints = d;
      }
    })

    // // 立柱地图
    // socket.on('pillarMap', (ip, d) => {
    //   console.log('store pillarMap', d);
    //   state.Robot[ip].pillarMap = d;
    // })


  },

  // ----------------------------- 发 布 消 息 （publish） -------------------------------------------

  // 控制底盘与云台
  control({ commit, state }, { ip, axes, buttons, frame_id }) {
    // console.log(axes, buttons, frame_id);
    state.socket.emit('control', ip, axes, buttons, frame_id);
  },

  // 导航
  sendNav({ commit, state }, { ip, data }) {
    state.socket.emit('sendNav', ip, data);
  },

  // 取消导航
  cancelNav({ commit, state }, { ip }) {
    state.socket.emit('cancelNav', ip);
    state.Robot[ip].navPath = [];
    reNavPath[ip] = [];
  },

  // 发送任务
  sendTask({ commit, state }, { ip, taskmsg }) {
    console.log('state sendTask', ip, taskmsg);
    state.socket.emit('sendTask', ip, taskmsg);
  },

  // 重定位
  initPose({ commit, state }, { ip, poses }) {
    // console.log('state initPose', ip, poses);
    state.socket.emit('initPose', ip, poses);
  },

  // 急停 暂停 继续
  async pauseTask({ commit, state }, { ip, num, taskId }) {
    const { id, recognition_type, task_name, task_nodes, back_node } = state.Robot[ip].taskState;
    const taskmsg = {//#类型： 1：运行 0:停止 2:暂停
      id, task_type: num, recognition_type, task_name, back_node, task_nodes,
    }

    // console.log('state pauseTask',ip,num,taskmsg);
    this.dispatch('socket/sendTask', { ip, taskmsg });
  },

  // 重启工控机
  reboot({ commit, state }, { ip }) {
    console.log('state reboot', ip);
    state.socket.emit('reboot', ip);
  }
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
};


function isPointInPolygon(point, polygon) {
  let [x, y] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    let [xi, yi] = polygon[i], [xj, yj] = polygon[j];
    let intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function findPVMIDForPoint(point, fences) {
  for (let fence of fences) {
    if (isPointInPolygon(point, fence.coordinates)) {
      return fence.PVMID;
    }
  }
  return 'All'; // 如果围栏中找不到点，则返回 null 或你需要的默认值
}