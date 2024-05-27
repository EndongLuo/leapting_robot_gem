import Vue from 'vue';
import Socket from '@/utils/socketUtil';
import { getRobot, getRobots, updateRobot, addRobot, deleteRobot } from '@/api/robot'
let rePose = { '10.168.4.230': [] }, reNavPath = {};
import bb from '@/components/Map_canvas/json/4S.json';

const state = {
  socket: null,
  ips: ['10.168.4.230'],
  taskState: {},
  siteId: localStorage.getItem('siteId') || "24",
  Robot: {},
  Robots: [],
  bb: bb,
  blockNames: '4S',
}

const mutations = {
  SET_SOCKET(state, socket) {
    state.socket = socket
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
    // console.log('setRobotPose', ip, d,bb);
    const point = [d.position.y, d.position.x]
    const point1 = [d.position.x, d.position.y]
    const fences = bb.features.map(i => ({
      coordinates: i.geometry.coordinates[0],
      PVMID: i.properties.PVMID 
    }));
    const PVMID = findPVMIDForPoint(point1, fences);
    // console.log('setRobotPose',  PVMID);
    state.blockNames = PVMID;
    
    if (!d.position.length) Vue.set(state.Robot[ip], 'robotPose', [-1000, -1000]);
    Vue.set(state.Robot[ip], 'robotPose', point);
    Vue.set(state.Robot[ip].markerOp, 'rotationAngle', d.orientation);
    rePose[ip] = point || [-1000, -1000];
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
    d.progress = ((d.done_nodes.length / d.task_nodes.length) * 100).toFixed(1);
    var a = {...d}
    Vue.set(state.Robot[ip], 'taskState1', a);
    Vue.set(state.Robot[ip], 'taskState', d);
    Vue.set(state.Robot[ip], 'taskStatus', d.task_type == 1);
    const P = 4;

    if (ip === '10.168.4.240') {
      const appendIndices = k => Array.from({ length: P }, (_, i) => k + '_' + (i + 1));

      // state.taskState1 = d;

      d.task_nodes = d.task_nodes.flatMap(appendIndices);
      d.done_nodes = d.done_nodes.flatMap(appendIndices);
      state.taskState = d;
    }

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
    console.log('state initPose', ip, poses);
    state.socket.emit('initPose', ip, poses);
  },

  // 急停 暂停 继续
  async pauseTask({ commit, state }, { ip, num, taskId }) {
    const { id, recognition_type, task_name, task_nodes, back_node } = state.Robot[ip].taskState1
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