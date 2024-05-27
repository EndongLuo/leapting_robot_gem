import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

import 'normalize.css/normalize.css'; //css resets
import '@/styles/index.scss'; // global css

import './icons'; //icon

import './permission'; // 路由导航守卫

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
Vue.use(Antd);

import scrollBar from '@/components/scrollBar';
import '@/components/scrollBar/index.scss';
Vue.component('scroll-bar', scrollBar);

import loading from '@/components/loading/loading'; // 引入loading
Vue.use(loading); // 全局使用loading

// 引入ElementUI
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';
Vue.use(ElementUI);

import './utils/fitScreen'

// Echarts
import echarts from "echarts";
Vue.prototype.$echarts = echarts;

// 滚动列表
import scroll from 'vue-seamless-scroll'
Vue.use(scroll)

// import './styles/element.scss';

import 'leaflet/dist/leaflet.css';
import L from "leaflet";
/* leaflet icon */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

import i18n from './components/language';//中英文切换

// //自适应不同分辨率
import 'lib-flexible-computer'


new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate() {
    Vue.prototype.$bus = this;
    // Vue.prototype.$API = API;
    // Vue.prototype.$IO = io;
  },
  i18n, 
}).$mount('#app');
