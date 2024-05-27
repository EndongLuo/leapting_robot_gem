import { getRobot, updateRobot, addRobot, deleteRobot } from '@/api/robot'

const state = {
  ips: ['10.168.4.240'],
  Robots:[],
};

const mutations = {
  // 添加一个mutation来更新Robots数据
  SET_ROBOTS(state, robots) {
    state.Robots = robots;
  },
};

const actions = {
  // 获取机器人数据的action
  async getRobots({ commit,state }) {
    const siteId = localStorage.getItem('siteId') || "24";
    console.log('robot siteId', siteId);
    const robot = await getRobot(siteId);
    // console.log(robot.data);
    // state.Robots = robot.data;
    // 使用commit来调用mutation
    commit('SET_ROBOTS', robot.data);
  },
};


export default {
  namespaced: true,
  state,
  mutations,
  actions
};
