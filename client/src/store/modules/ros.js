import { io } from "socket.io-client";
const state = {
  // ips: ['10.168.4.240'],
  // socket : io('/robot', { query: { ip: JSON.stringify(['10.168.4.240'])}}),
  // socket : io('/robot', { query: { ip: JSON.stringify(['10.168.5.211'])}}),
  // socket1 : io('/QS', { query: { ip: JSON.stringify(['10.168.4.230'])}}),
  // socket : io('/QS', {reconnect: false, query: { ip: JSON.stringify(['10.168.4.240'])}}) 
};

const mutations = {
  // SET_ROUTE(state, route) {
  //   state.routes = baseRoute.concat(route);
  // }
};

const actions = {
  // getRoute({ commit }, role) {
  //   return new Promise((resolve, reject) => {
  //     let accessedRoutes = [];
  //     if (role == 'admin') {
  //       accessedRoutes = asyncRoutes;
  //     } else {
  //       accessedRoutes = filterAsyncRoute(asyncRoutes, role);
  //     }
  //     commit('SET_ROUTE', accessedRoutes);
  //     resolve(accessedRoutes);
  //   });
  // }
};


export default {
  namespaced: true,
  state,
  mutations,
  actions
};
