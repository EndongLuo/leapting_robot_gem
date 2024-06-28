<template>
  <div class="dataScreen ">

    <div style="width: 100%;height: 100%;background-color: #ffffff02; position: fixed; top: 0;left: 0;;">
      <div style="width: 100%;height: 100%;position: relative;">
        <div v-for="i in 5" :key="i" :class="`layer${i}`"></div>
      </div>
    </div>


    <!-- 中间 -->
    <!-- <div class="c_main">
      <Maps @Pause="pauseTask(0)"  />
    </div> -->

    <!-- 顶部 -->
    <div class="top">
      <img src="/img/title.png" alt="">
      <div class="logo"><img src="/img/logo.png" alt=""></div>
      <div class="title" style=" font-weight: 700;">{{ $t('home.title') }}</div>
      <div class="t_btn">
        <div class="svgicon">
          <!-- {{ nowTime }} -->

          <!-- {{ info.rtt }}ms
          {{ info.downlink }}mb/s -->

          <div @click="changeLanguage()">
            <svg-icon class="icon" icon="zn" :size="30" slot="prefix" />
          </div>
          <div @click="handleFullScreen">
            <svg-icon class="icon" v-if="!fullscreen" icon="QP" :size="24" slot="prefix"></svg-icon>
            <svg-icon class="icon" v-else icon="escQP" :size="24" slot="prefix"></svg-icon>
          </div>
          <div @click="settingFn">
            <svg-icon class="icon" icon="setting" :size="30" slot="prefix"></svg-icon>
          </div>
        </div>
      </div>
      <div class="t_time">
        {{ nowTime }}
      </div>
    </div>

    <!-- <div></div> -->

    <div class="main">
      <!-- 左边 -->
      <div class="left">
        <!-- <div class="l-top"> -->
        <!-- <div v-if="taskStatus" class="task_title">{{ $t('home.real_timeTask') }}</div> -->
        <div v-for="r in Robots" :key="r.id">

          <div class="task_box" v-if="Robot[r.ip].taskState.id"
            style="position: relative; height:1rem; font-size: .1rem;">
            <span class="fonts">{{ $t('home.taskId') }}: </span>{{ Robot[r.ip].taskState.id }}<br />
            <span class="fonts">{{ $t('home.taskName') }}: </span>{{ Robot[r.ip].taskState.task_name }}<br />
            <span class="fonts">{{ $t('home.taskProgress') }}: </span>{{ Robot[r.ip].taskState.progress }}%<br />
            <span class="fonts">{{ $t('home.deviceName') }}: </span>{{ r.robotname }}<br />
            <span class="fonts">{{ $t('home.odom') }}: </span>{{ Robot[r.ip].taskState.task_odom }}<br />
            <span class="fonts">{{ $t('home.taskStartTime') }}: </span>{{ Robot[r.ip].taskState.start_time }}<br />
            <div class="h_fonts" v-if="Robot[r.ip].taskState.task_type == 4">{{ $t('home.completed') }}</div>
            <template v-else>
              <div class="h_fonts" v-if="Robot[r.ip].taskState.task_type == 1">{{ $t('home.executing') }}</div>
              <div class="h_fonts" v-else-if="Robot[r.ip].taskState.task_type == 2">{{ $t('home.pause') }}</div>
              <div class="h_fonts" v-else-if="Robot[r.ip].taskState.task_type == 0">{{ $t('home.stop') }} </div>
            </template>
            <div style="position: absolute; right: .05rem; top: .2rem;">
              <div style="display: flex; flex-direction: column; align-items: flex-end;">
                <template v-if="(Robot[r.ip].taskState.task_type !== 4 && Robot[r.ip].taskState.task_type !== 0)">
                  <template v-if="Robot[r.ip].taskState.task_type !== 2">
                    <div class="el-button" style="width: .5rem;" @click="pauseTask(r.ip, 2)">{{ $t('home.pause') }}
                    </div>
                  </template>
                  <template v-else>
                    <div class="el-button" style="width: .5rem;" @click="pauseTask(r.ip, 1)">{{ $t('home.continue') }}
                    </div>
                  </template>
                  <div class="el-button" style="margin-top: .05rem; width: .5rem;" @click="pauseTask(r.ip, 0)">
                    {{ $t('home.stop') }}</div>
                </template>
              </div>
            </div>
          </div>
        </div>

        <div class="task_title">{{ $t('home.abnormalPVM') }}</div>
        <div class="l_bottom">
          <div style="display: flex;">
          </div>
          <scrollList @Abnomrl="Abnomrl" />
        </div>
      </div>

      <!-- 右边 -->
      <div class="right">
        <div v-if="Robots.length" class="task_title">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link" style="color: #fff;">
              {{ $t('home.deviceInfo') }}<i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="r, index in Robots" :key="index" :command="index">{{ r.robotname
                }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <swiper class="swiper" style="width: 100%;" :options="swiperOption" ref="mySwiper" @slideChange="onSlideChange">
          <swiper-slide v-for="r in Robots" :key="r.id" :id="r.ip">
            <div class="vehicle">
              <!-- 巡检 -->
              <div class="task_box">
                <div style="display: flex;">
                  <img src="./img/XJ.png" class="robot_card" alt="" @click="setPose(r.ip)">
                  <div class="context_ring">
                    <div class="ring_box">
                      <div v-if="!Robot[r.ip].rosConnect" class="r_ring"><i class="el-icon-error"
                          style="color: #F56C6C;"></i>
                      </div>
                      <div v-else>
                        <div v-if="Robot[r.ip].taskStatus" class="r_ring"><i class="el-icon-loading"
                            style="color: #67C23A; "></i>
                        </div>
                        <div v-else-if="Robot[r.ip].bunkerStatus.charge == 1" class="r_ring">
                          <div class="anm"></div><img src="./img/charge.png" alt="">
                        </div>
                        <div v-else class="r_ring"><i class="el-icon-success" style="color: #67C23A; "></i></div>
                      </div>
                      <!-- <div v-else class="r_ring"><i class="el-icon-success" style="color: #67C23A; "></i></div> -->
                      <div>{{ $t('home.connectStatus') }}</div>
                    </div>

                    <div class="ring_box">
                      <div v-if="!Robot[r.ip].rosConnect" class="r_ring">--</div>
                      <div v-else class="r_ring">{{ Robot[r.ip].bunkerStatus.battery }}</div>
                      <div>{{ $t('home.battery') }}</div>
                    </div>
                    <div class="ring_box">
                      <div v-if="!Robot[r.ip].rosConnect" class="r_ring">--</div>
                      <div v-else class="r_ring">{{ Robot[r.ip].bunkerStatus.speed }}</div>
                      <div>{{ $t('home.velocity') }}</div>
                    </div>

                    <div class="ring_box">
                      <!-- <div v-if="!rosConnect" class="r_ring"><i class="el-icon-error" style="color: #F56C6C;"></i></div> -->
                      <div v-if="!Robot[r.ip].rosConnect" class="r_ring">--</div>
                      <div v-else @click="diagnosticIp(r.ip)">
                        <div class="r_ring" v-if="Robot[r.ip].diagnostic.status == 3"><i class="el-icon-question"
                            style="color: #F56C6C; "></i>
                        </div>
                        <div class="r_ring" v-else-if="Robot[r.ip].diagnostic.status == 2"><i class="el-icon-error"
                            style="color: #F56C6C;"></i>
                        </div>
                        <div class="r_ring" v-else-if="Robot[r.ip].diagnostic.status == 1"><i class="el-icon-warning"
                            style="color: #E6A23C;"></i></div>
                        <div class="r_ring" v-else><i class="el-icon-success" style="color: #67C23A; "></i></div>
                      </div>
                      <div>{{ $t('home.alarm') }}</div>
                    </div>

                    <img @click="pauseTask(r.ip, 0)" class="pause"
                      style="width: 0.3rem;height: 0.3rem; margin-left: 0.1rem" src="./img/Stop.png" alt="Pause" />
                    <img @click="initpose(r.ip)" class="initpose"
                      style="width: 0.3rem;height: 0.3rem; margin-left: 0.1rem" src="./img/initPose.png"
                      alt="initPose" />
                  </div>
                </div>

                <div style="margin-top: .1rem; font-size: .1rem; color: #9cdcfe;">
                  <span class="fonts">{{ $t('home.deviceName') }}：</span>{{ r.robotname }}<br />
                  <!-- <span class="fonts">{{ $t('home.deviceId') }}：</span>LPIR-T600-230<br /> -->
                  <!-- <span class="fonts">{{$t('home.abnormalPVM')}}运行时间：</span>11时42分23秒 -->
                </div>

                <div class="device_control">
                  <div class="el-button-group " v-if="Robot[r.ip].rosConnect">
                    <div class="el-button " @click="_isMobile(r.ip, r.ptzurl)">{{ $t('home.control') }}</div>
                    <div class="el-button " v-if="isShow == 2" @click="isShow = 0">{{ $t('home.DataOverview') }}</div>
                    <div class="el-button " v-else @click="PTZControl(r.ip)">{{ $t('home.PTZControl') }}</div>
                    <div class="el-button " @click="isUnderfun(r.ptzurl)">{{ $t('home.PTZVideo') }}</div>
                  </div>
                  <div class="el-button-group " v-else>
                    <div class="el-button disabled">{{ $t('home.control') }}</div>
                    <div class="el-button disabled">{{ $t('home.DataOverview') }}</div>
                    <!-- <div class="el-button " disabled>{{ $t('home.PTZControl') }}</div> -->
                    <div class="el-button disabled">{{ $t('home.PTZVideo') }}</div>
                  </div>
                </div>
              </div>
            </div>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>


        <div class="task_title" v-if="isShow == 2">{{ $t('home.PTZControl') }}</div>
        <div class="task_title" v-else>{{ $t('home.DataOverview') }}</div>
        <div class="r_bottom">

          <!-- 云台 机械臂 -->
          <div v-if="isShow == 2" style="display: flex;">
            <!--  云台控制 -->
            <div v-if="!isShowQs">
              <div class="el-button-group ">
                <div class="el-button zdy" @mousedown="lens(-1, 1)" @mouseup="ptzStop" @touchstart.prevent="lens(-1, 1)"
                  @touchend="ptzStop"><i class="el-icon-top-left"></i>
                </div>
                <div class="el-button zdy" @mousedown="lens(0, 1)" @mouseup="ptzStop" @touchstart.prevent="lens(0, 1)"
                  @touchend="ptzStop"><i class="el-icon-top"></i></div>
                <div class="el-button zdy" @mousedown="lens(1, 1)" @mouseup="ptzStop" @touchstart.prevent="lens(1, 1)"
                  @touchend="ptzStop"><i class="el-icon-top-right"></i>
                </div>
              </div>
              <br />
              <div class="el-button-group ">
                <div class="el-button zdy" @mousedown="lens(-1, 0)" @mouseup="ptzStop" @touchstart.prevent="lens(-1, 0)"
                  @touchend="ptzStop"><i class="el-icon-back"></i></div>
                <div class="el-button zdy" disabled><i class="el-icon-coordinate" @mousedown="huiz" @mouseup="ptzStop"
                    @touchstart.prevent="huiz" @touchend="ptzStop"></i>
                </div>
                <div class="el-button zdy" @mousedown="lens(1, 0)" @mouseup="ptzStop" @touchstart.prevent="lens(1, 0)"
                  @touchend="ptzStop"><i class="el-icon-right"></i></div>
              </div>
              <br />
              <div class="el-button-group ">
                <div class="el-button zdy" @mousedown="lens(-1, -1)" @mouseup="ptzStop"
                  @touchstart.prevent="lens(-1, -1)" @touchend="ptzStop"><i class="el-icon-bottom-left"></i>
                </div>
                <div class="el-button zdy" @mousedown="lens(0, -1)" @mouseup="ptzStop" @touchstart.prevent="lens(0, -1)"
                  @touchend="ptzStop"><i class="el-icon-bottom"></i>
                </div>
                <div class="el-button zdy" @mousedown="lens(1, -1)" @mouseup="ptzStop" @touchstart.prevent="lens(1, -1)"
                  @touchend="ptzStop"><i class="el-icon-bottom-right"></i>
                </div>
              </div>
            </div>


            <!-- 机械臂控制 -->
            <div v-else>
              <div v-for="i in 4" :key="i">
                <div class="el-button-group ">
                  <div class="el-button zdy" @mousedown="arm(i, -0.1)" @mouseup="arm(1)"
                    @touchstart.prevent="arm(i, -0.1)" @touchend="arm(1)"><i class="el-icon-minus"></i></div>
                  <div class="el-button zdy">{{ i }}</div>
                  <div class="el-button zdy" @mousedown="arm(i, 0.1)" @mouseup="arm(1)"
                    @touchstart.prevent="arm(i, 0.1)" @touchend="arm(1)"><i class="el-icon-plus"></i></div>
                </div>
                <br />
              </div>
            </div>
          </div>
          <div v-else>
            <Charts />
          </div>

        </div>
      </div>
    </div>

    <!-- 底部 -->
    <div class="under" v-if="isUnder">
      <div class="video">
        <inspection :PTZURL="PTZURL" />
      </div>
    </div>

    <!-- <Maps class="test_main" /> -->
    <Map_canvas :initialpose="initialpose" :IP="IP" :nowpose="nowpose" @change="change" class="test_main" />

    <div class="kuang" v-show="isShow == 1">
      <i class="el-icon-close" @click="isShow = 0;"></i>
      <!-- 机器人遥控 -->
      <div v-if="isShow == 1">
        <Telecontrol :IP="IP" :PTZURL="PTZURL.q" />
      </div>
    </div>


    <!-- 异常组件 -->
    <el-dialog :visible.sync="dialogVisible" :title="selectedRow.node_name + '：' + selectedRow.recognition_type + ' '"
      width="60%">
      TaskID：{{ selectedRow.task_id }} <br />
      Time：{{ selectedRow.update_time }}
      <img :src="selectedRow.image_url" alt="Image" style="width: 100%; ">
    </el-dialog>

    <!-- 诊断详情 -->
    <el-dialog :visible.sync="diagnosticList" title="Diagnostics" center width="60%">
      <div v-if="Robot[IP]"
        style="display: flex; padding: 10px 50px 50px;  flex-wrap: wrap; color: #fff; font-size: .2rem;">

        <div v-for="d, index of Robot[IP].diagnostic.list" :key="index"
          style="border: #02d9fd 1px solid;margin: -1px 0 0 -1px; padding: 20px 50px; width: 50%; display: flex; ">
          <span v-if="d.value == 3"><i class="el-icon-question" style="color: #F56C6C; margin-right: 10px;"></i></span>
          <span v-else-if="d.value == 2"><i class="el-icon-error"
              style="color: #F56C6C; margin-right: 10px;"></i></span>
          <span v-else-if="d.value == 1"><i class="el-icon-warning"
              style="color: #E6A23C; margin-right: 10px;"></i></span>
          <span v-else><i class="el-icon-success" style="color: #67C23A; margin-right: 10px;"></i></span>
          {{ d.key }}
          <br />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Map_canvas from "@/components/Map_canvas";
import inspection from "./inspection.vue";
import scrollList from './scrollList.vue';
import Telecontrol from "@/components/Telecontrol";
import Charts from './echarts.vue'

import { getCache } from '@/utils/session';
// import 'echarts-liquidfill';

import { mapState, mapActions } from 'vuex';
import { transTimestamp, formatDate } from '@/utils/timeUTC'
import { updateTaskInfoState, updateTaskInfo } from '@/api/task'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import 'swiper/css/swiper.css';



export default {
  data() {
    return {
      ismap: true,
      // ismap: false,
      isShowQs: false,
      isShow: 0,
      isUnder: false,
      farScreen: true, // 远景
      fullscreen: false, // 是否全屏
      task1: 1,
      nowTime: '', //现在时间
      timer: '',
      AccessToken: getCache('accessToken'),
      dialogVisible: false,
      selectedRow: {},
      initialpose: false,
      nowpose: [0, 0],
      diagnosticList: false,
      IP: '',
      PTZURL: '',
      swiperOption: {
        // autoplay: {
        //   delay: 10000,
        //   disableOnInteraction: false
        // },
        // loop: true,
        pagination: {
          el: '.swiper-pagination',
          type: 'fraction'
        },
      },
      info: {}
    };
  },
  components: { inspection, scrollList, Map_canvas, Telecontrol, Charts, Swiper, SwiperSlide, },
  computed: {
    ...mapState('socket', ['Robot', 'Robots', 'taskState']),
  },
  async created() {
    this.$store.dispatch('socket/init');
    // this.init;// 初始化
    this.$store.dispatch('socket/getRobot');
    // console.log('created index');
    this.timer = setInterval(this.getNowDate, 1000);
    // setInterval(this.updateInfo, 1000);

    // // 监听网络在线状态
    // window.addEventListener("onLine", this.updateInfo)
    // // 监听网络离线
    // window.addEventListener("offLine", this.updateInfo)
    // // 监听网络信息变化
    // navigator.connection.addEventListener('change', this.updateInfo)
  },
  methods: {
    updateInfo() {
      // console.log(1);
      // 获取网络状态
      let isOnLine = navigator.onLine
      // 获取网络信息
      this.info = navigator.connection
      if (isOnLine) {
        // 网络在线
        console.log('网络在线', this.info.rtt + 'ms', this.info.downlink + 'mbps');
      } else {
        // 网络离线
        console.log('网络离线');
      }
    },
    onSlideChange() {
      const swiper = this.$refs.mySwiper.$swiper;
      const activeSlide = swiper.slides[swiper.activeIndex];
      const ip = activeSlide.id;
      console.log('Current slide ID:', ip);
      localStorage.setItem('nowIP', ip);
      this.$store.commit('socket/SET_NOWIP', ip);
    },
    // 下拉框切换robot
    handleCommand(index) {
      // console.log(index);
      const swiper = this.$refs.mySwiper.$swiper;
      // 设置 activeIndex 到指定的索引
      swiper.slideTo(index);
    },
    diagnosticIp(ip) {
      this.diagnosticList = true;
      this.IP = ip;
    },
    PTZControl(ip) {
      // this.isShow = 0
      this.isShow = 2;
      this.IP = ip;
      console.log(this.IP);
    },
    setPose(ip) {
      // console.log(this.robotPose);
      this.nowpose = this.Robot[ip].robotPose;
    },
    // 判断是否为移动端
    _isMobile(ip, ptzurl) {
      let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
      // return flag
      if (flag) {
        this.isShow = 1;
        this.isUnder = false
      }
      else this.$message.error(`${this.$t('home.isMobile')}`);
      this.isShow = 1;
      console.log(ptzurl);
      this.IP = ip;
      this.PTZURL = ptzurl;
    },
    // 异常组件
    Abnomrl(row) {
      this.selectedRow = row;
      this.selectedRow.update_time = formatDate(this.selectedRow.update_time)
      // this.selectedRow.update_time=this.selectedRow.update_time.replace('T',' ').slice(0,-5)
      console.log(row);
      this.dialogVisible = true;
    },
    // 急停
    async pauseTask(ip, num) {
      // this.$store.dispatch('socket/reboot');
      this.$store.dispatch('socket/pauseTask', { ip, num });
      var res = await updateTaskInfoState({ id: this.Robot[ip].taskState.id });
      if (res.code == 200) console.log('Update success');
      if (num == 0) this.$store.dispatch('socket/cancelNav', { ip });
    },
    settingFn() {
      this.$router.push('/components/setting')
    },

    /* 机械臂控制
     * @param {number} axle 轴
     * @param {number} rot 旋转角度
     * 如：2轴正0.1，arm(2, 0.1) 
     *     停止：arm(1)
    */
    arm(axle, rot = 0) {
      var frame_id = 'jtc'
      var axes = Array(8).fill(0);

      axes[axle - 1] = rot;
      this.$store.dispatch('socket/control', { frame_id, axes })
    },

    // 镜头控制 Rotation旋转, Vertical垂直
    lens(Rot = 0, Ver = 0) {
      console.log("水平旋转：", Rot, '---垂直：', Ver);
      var axes = [Rot, Ver, 0, 0, 0, 0, 0, 0];
      var buttons = [1, 0, 0, 0, 0, 0, 0, 0];

      this.$store.dispatch('socket/control', { ip: this.IP, axes, buttons })
    },
    // 云台回正
    huiz() {
      var axes = [0, 0, 1, 0, 0, 0, 0, 0];
      this.$store.dispatch('socket/control', { ip: this.IP, axes })
    },
    // 云台停止
    ptzStop() {
      console.log("云台停止");
      var axes = [1, 1, 0, 0, 0, 0, 0, 0];
      this.$store.dispatch('socket/control', { ip: this.IP, axes })
    },
    isUnderfun(ptzurl) {
      this.isShow = 0;
      this.PTZURL = ptzurl;
      if (this.isUnder) {
        this.isUnder = false;
      }
      else this.isUnder = true;
    },
    initpose(ip) {
      this.IP = ip;
      this.initialpose = true;
      this.$message('Initial Pose');
    },
    change(value) {
      // console.log(Boolean(value));
      this.initialpose = Boolean(value)
    },
    // 视角切换
    changeScreen() {
      if (this.farScreen) this.farScreen = false;
      else this.farScreen = true
      this.$bus.$emit('farScreen', this.farScreen);
    },
    // 切换语言
    changeLanguage() {
      this.$i18n.locale == 'zh' ? this.$i18n.locale = 'en' : this.$i18n.locale = 'zh'   //设置中英文模式
      localStorage.setItem('languageSet', this.$i18n.locale)   //将用户设置存储到localStorage以便用户下次打开时使用此设置
    },
    // 全屏事件
    handleFullScreen() {
      let element = document.documentElement;
      // 判断是否已经是全屏
      // 如果是全屏，退出
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        console.log('已还原！');
      } else {    // 否则，进入全屏
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
        console.log('已全屏！');
      }
      // 改变当前全屏状态
      this.fullscreen = !this.fullscreen;
    },

    // 时间
    getNowDate() {
      var date = new Date();
      var sign2 = ':';
      var year = date.getFullYear(); // 年
      var month = date.getMonth() + 1; // 月
      var day = date.getDate(); // 日
      var hour = date.getHours(); // 时
      var minutes = date.getMinutes(); // 分
      var seconds = date.getSeconds(); //秒
      var weekArr = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      var week = weekArr[date.getDay()];

      month = month < 10 ? '0' + month : month;
      day = day < 10 ? '0' + day : day;
      hour = hour < 10 ? '0' + hour : hour;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;

      this.nowTime = year + '-' + month + '-' + day + ' ' + hour + sign2 + minutes + sign2 + seconds + ' ' + week;
    },
  },
  beforeDestroy() {
    if (this.timer) clearInterval(this.timer);
  }
};
</script>
<style lang="scss" scoped>
@import '../../styles/element.scss';

.disabled {
  cursor: not-allowed;
  filter: grayscale(80%);
}

.kuang {
  position: fixed;
  bottom: 0%;
  background: #000000bd;
  margin-left: -10px;
  // border-radius: 10px;
  // box-shadow: 0px 0px 20px 10px rgb(36 36 36 / 50%), inset 0px 5px 20px 10px rgb(100 100 100 / 50%);
  width: 100%;
  height: 250px;
  z-index: 1000;

  .el-icon-close {
    position: absolute;
    right: 10px;
    top: 10px;
    color: #b9b9b9;
    cursor: pointer;
    z-index: 100;

    &:hover {
      color: #d6d6d6;
    }
  }

  .control {
    display: flex;
    justify-content: center;
  }
}

.device_control {
  display: flex;
  margin: .1rem 0;
  font-size: .1rem;
  justify-content: center;
}

.pause {
  // margin: 0 5px;
  width: 100%;

  &:hover {
    width: 90%;
    padding: 3px;
    background: #ffffffd8;
    border-radius: 50%;
  }
}

.initpose {
  // margin: 0 5px;
  width: 100%;
  transform: scale(1.2);

  &:hover {
    transform: scale(1);
  }
}

@function randomColor() {
  $red: floor(random() * 256);
  $green: floor(random() * 256);
  $blue: floor(random() * 256);
  $alpha: random();

  @return rgba($red, $green, $blue, $alpha);
}

// 生成随机颜色
$random-color: randomColor();

@function getShadow($n) {
  $shadows: '#{random(100)}vw #{random(100)}vh 2px #fff';

  @for $i from 2 through $n {
    $shadows: #{$shadows}, #{random(100)}vw #{random(100)}vh #{random(2)}px randomColor();
  }

  @return unquote($shadows);
}

$duration: 600s;
$count: 600;

@for $i from 1 through 5 {
  $duration: $duration/2;
  $count: floor($count/2);

  .layer#{$i} {
    $size: #{$i}px;

    position: absolute;
    width: $size;
    height: $size;
    border-radius: 50%;
    top: 0;
    left: 0;
    box-shadow: getShadow($count);
    animation: move $duration linear infinite;

    // z-index: 100;
    &::after {
      content: '';
      position: absolute;
      left: 0;
      top: 100vh;
      border-radius: inherit;
      width: inherit;
      height: inherit;
      box-shadow: inherit;
    }
  }
}

@keyframes move {
  to {
    transform: translateY(-100vh);
  }
}

.dataScreen {
  // background-color: #0f0f0f;
  background-image: url(./img/bg.png);
  // background-image: url(./img/6.png);
  // background-image: url(./img/10.gif);
  /* 不平铺 */
  background-repeat: no-repeat;
  /* 居中显示 */
  background-position: center;
  /* 拉伸占满整个容器 */
  background-size: cover;
  color: #eeeeee;
  font-size: .1rem;

}

// .dataScreen::after {
//   content: "";
//   position: absolute;
//   top: 0;
//   right: 0;
//   bottom: 0;
//   left: 0;
//   box-sizing: border-box;
//   box-shadow: inset 0 0 150px 1px rgba(255, 0, 0, 0.7);
//   pointer-events: none;
//   z-index: 100;
// }

.context_ring {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.ring_box {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: .1rem;
  justify-content: center;
}

.r_ring {
  position: relative;
  border: 0.05rem solid #0f6ab0;
  border-radius: 50%;
  width: .3rem;
  height: .3rem;
  font-weight: 700;
  text-align: center;
  // line-height: .2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  i {
    font-size: .2rem;
  }

  img {
    width: .2rem;
    z-index: 1;
  }
}

.anm {
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: #67C23A;
  animation: colorChange 6s infinite normal;
  // z-index: 0;
}

@keyframes colorChange {
  0% {
    height: 0;
  }

  100% {
    height: 100%;
  }
}


.top {
  position: relative;
  overflow: hidden;
  background: #24242438;
  height: 10vh;
  backdrop-filter: blur(10px);
  z-index: 100;

  img {
    margin-top: 10px;
    width: 100%;
  }

  .logo {
    position: absolute;
    top: 30%;
    left: 12%;
    transform: translate(-50%, -50%);
    width: 1rem;

    img {
      width: 100%;
      animation: zxc 8s infinite linear;
    }

    @keyframes zxc {
      0% {
        transform: rotateY(-360deg);
      }

      100% {
        transform: rotateY(0deg);
      }
    }
  }

  .title {
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: .2rem;
    transform: translate(-50%, -50%);
  }

  .svgicon {
    display: flex;
    align-items: center;

    .icon {
      margin-left: 10px;
    }
  }

  .t_btn,
  .t_r {
    position: absolute;
    top: .1rem;
    right: .1rem;
    cursor: pointer;
  }

  .t_time {
    position: absolute;
    top: .47rem;
    right: .12rem;
    cursor: pointer;
  }

  .t_r {
    // right: 10%;
    margin-right: .3rem;
    font-size: .1rem;
  }
}

.main {
  display: flex;
  justify-content: space-between;
}

.left,
.right {
  width: 20%;
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: .1rem;


  .task_title {
    width: 100%;
    height: .2rem;
    color: #f0f0f0;
    line-height: .2rem;
    padding-left: .2rem;
    font-weight: 700;

    background-image: url('./img/title.png');
    background-size: 100% 100%;
  }
}

.fonts {
  color: #eeeeee;
  font-weight: 700;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.left {
  z-index: 100;

  .task_box {
    backdrop-filter: blur(10px);
    // background-color: #1eaefc23;
    // border: .05rem solid transparent;
    border: 1px solid #0f6ab031;
    padding: .05rem;
    overflow: hidden;

    color: #9cdcfe;
    // border-image: url('./img/box02.png') 33 stretch;
    // margin-bottom: .1rem;
    font-size: .1rem;

    .h_fonts {
      color: aqua;
      position: absolute;
      right: .1rem;
      top: 0px;
      font-size: .1rem;
    }
  }

  .task_s {
    cursor: pointer;
    color: #58b0ff;

    &:hover {
      color: aqua;
    }
  }

  .l-top {
    backdrop-filter: blur(10px);
    font-size: .1rem;
    border: .1rem solid transparent;
    // border-image: url('./img/border.png') 33 stretch;
    background: #24242438;
    // background: #242424;

    height: 47%;
    overflow: hidden;
  }

  .l_bottom {
    backdrop-filter: blur(10px);
    background: #24242438;
    border: .1rem solid transparent;
    // border-image: url('./img/box02.png') 33 stretch;
    // height: 78%;
    height: 100%;
    // margin-top: 20px;
    overflow: hidden;
  }
}

.right {
  z-index: 100;

  .vehicle {
    backdrop-filter: blur(10px);
    background: #24242438;
    border: .1rem solid transparent;
    // border-image: url('./img/box02.png') 33 stretch;
    overflow: hidden;
    margin-bottom: .1rem;

    .robot_card {
      border: #9cdcfe 2px solid;
      border-radius: 10px;
      padding: 2px;
      width: 47%;
    }
  }

  .r_bottom {
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50%;
    background: #24242438;
    border: .1rem solid transparent;
    // border-image: url('./img/box02.png') 33 stretch;
    // overflow: hidden;

    .el-col-12 {
      width: 100%;
      margin-top: .1rem;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
  }
}

.zdy {
  background-color: #27aae633;
  border-color: #40a5f4;
  color: #eeeeee;
  height: .4rem;
  display: flex;
  align-items: center;
  font-size: .2rem;
}

.zdy:hover {
  background-color: #27aae65e;
  border-color: #40a6f4ce;
}

.c_main {
  position: absolute;
  margin-bottom: .1rem;
  width: 60%;
  height: 86vh;
  background: #24242438;
  bottom: 0px;
  left: 20%;
  overflow: hidden;

  border: .1rem solid transparent;
  border-image: url('./img/box02.png') 33 stretch;
}

.test_main {
  position: absolute;
  // margin-bottom: .1rem;
  width: 100%;
  height: 100vh;
  background: #24242438;
  bottom: 0px;
  // left: 20%;
  // overflow: hidden;
  z-index: 0;

  // border: .1rem solid transparent;
  // border-image: url('./img/box02.png') 33 stretch;
}

.under {
  backdrop-filter: blur(10px);
  position: absolute;
  margin-bottom: .1rem;
  width: 60%;
  height: 1.8rem;
  background: #24242438;
  bottom: 0;
  left: 20%;
  overflow: hidden;

  border: .1rem solid transparent;
  // border-image: url('./img/box02.png') 33 stretch;

  z-index: 1000;

  .video {
    margin-top: -0.2rem;
    width: 100%;
    overflow: hidden;
  }
}

.video1 {
  margin-top: -40px;
  transform: rotateZ(90deg);
}

/deep/ #he-plugin-standard {
  height: 300px !important;
  width: 100% !important;
}


// .video {
//   display: flex;
//   flex-wrap: wrap;
//   // margin: -23px -30px;

// //   border: 23px solid transparent;
// //     border-image: url('./img/border.png') 33 stretch;
// }</style>