<template>
  <div class="joys">
    <!-- 前后 -->
    <div class="page">
      <div style="margin-top: 100px; margin-left: 50%; position: relative">
        <!-- 触摸识别区域部分 -->
        <div class="toucharea" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchcancel="onTouchEnd"
          @touchend="onTouchEnd" @touchmove.prevent @mousewheel.prevent>
          <div style="border-radius: 50%" :style="{
          width: touchRadius * 2 + 'px',
          height: touchRadius * 2 + 'px',
        }"></div>
        </div>
        <!-- 上部小图 -->
        <div class="ball" :style="{ left: '0px', top: top + 'px' }"
          :class="{ animation: inDraging === false && transition }">
          <div style="width: 70px; height: 70px">
            <img src="./img/ball2.png" style="width: 100%; height: 100%" />
          </div>
        </div>
        <!-- 底部大图 -->
        <div class="bottom">
          <div style="width: 200px; height: 200px">
            <!-- <div style="width: 3.5rem; height: 3.5rem"> -->
            <img src="./img/22.png" style="width: 100%; height: 100%" />
          </div>
        </div>
      </div>
    </div>

    <!-- 前方视屏 -->
    <div style="height:100%; width: 50%; position: relative; ">
      <div style="position: absolute; width: 100%;height: 100%; background-color: #ffffff00;"></div>
      <iframe :src="PTZURL" style="height:250px; width:100%;margin:0;border:0;" frameborder="0"
        scrolling="no"></iframe>
    </div>

    <!-- 左右 -->
    <div class="page">
      <div style="margin-top: 100px; margin-left: 50%; position: relative">
        <!-- 触摸识别区域部分 -->
        <div class="toucharea" @touchstart="onTouchStart1" @touchmove="onTouchMove1" @touchcancel="onTouchEnd1"
          @touchend="onTouchEnd1" @touchmove.prevent @mousewheel.prevent>
          <div style="border-radius: 50%" :style="{
          width: touchRadius * 2 + 'px',
          height: touchRadius * 2 + 'px',
        }"></div>
        </div>
        <!-- 上部小图 -->
        <div class="ball" :style="{ left: left + 'px', top: '0px' }"
          :class="{ animation: inDraging1 === false && transition }">
          <div style="width: 70px; height: 70px">
            <img src="./img/ball2.png" style="width: 100%; height: 100%" />
          </div>
        </div>

        <!-- 底部大图 -->
        <div class="bottom">
          <div style="width: 200px; height: 200px">
            <!-- <div style="width: 3.5rem; height: 3.5rem"> -->
            <img src="./img/11.png" style="width: 100%; height: 100%" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
var startLeft, startTop;
// 两点之间的距离函数
var getDistance = function (x1, y1, x2, y2) {
  // 手指滑动的距离取绝对值Math.abs
  var _x = Math.abs(x1 - x2);
  var _y = Math.abs(y1 - y2);
  // Math.sqrt求平方根
  return Math.sqrt(_x * _x + _y * _y);
};
export default {
  props: ["stop", 'velocity','PTZURL'],
  data() {
    return {
      autocross: true,
      beetleLeft: 0, //旋转方向
      beetleTop: 0, //旋转方向
      Rotate: 0, //摇杆旋转角度
      touchRadius: 100, //触摸识别区域的半径
      ballMoveRadius: 50, //杆头的移动范围半径
      transition: false,
      left: 0, //摇杆图标显示位置
      top: 0,
      stickHeight: 0, //两点之间的距离 （斜边）
      angle: 0, //两点之间旋转的夹角
      inDraging: false,
      inDraging1: false,
      flowSrc: 'http://10.168.4.101/player/webrtc?streamPath=hlsram/live2'
    };
  },
  // computed: {
  //   ...mapState('ros',['ros']),
  // },
  mounted() {
    // 禁用双指放大
    document.documentElement.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) e.preventDefault();
    }, { passive: false });

    this.loop();

    // this.avoidanceEcho();
  },
  methods: {
    // 避障数据回显
    avoidanceEcho() {

      var pvsize_sub = new ROSLIB.Topic({
        ros: this.ros,
        name: '/robot_state',
        messageType: 'std_msgs/String'
      });

      pvsize_sub.subscribe((msg) => {
        msg = JSON.parse(msg.data);
        this.autocross = msg.dynparam.filter_enabled;
      })
    },
    // 修改避障状态
    upDataAvoidance() {
      var updatasize_sub = new ROSLIB.Topic({
        ros: this.ros,
        name: '/robot_command',
        messageType: 'std_msgs/String'
      });
      if (!this.autocross) {
        console.log(this.autocross);
        this.$confirm(`是否确认关闭避障`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true,
          type: 'warning'
        }).then(() => {
          updatasize_sub.publish({ data: `{"dynparam": {"cmd_vel_filter": {"filter_enabled": ${this.autocross}}}` });

          this.$message.success('避障已关闭!');
        }).catch(() => {
          this.autocross = true
          this.$message({
            type: 'info',
            message: '取消关闭'
          });
        });
      } else {
        updatasize_sub.publish({ data: `{"dynparam": {"cmd_vel_filter": {"filter_enabled": ${this.autocross}}}` });
      }

    },

    /**参数说明 angle 旋转的角度 direction X Y 两个邻边  power 两点之间的距离比上最大摇杆移动距离*/
    // 手指触摸屏幕事件
    onTouchStart(e) {
      var curTouch = e.targetTouches[0];

      // 获取触摸坐标
      // startLeft = curTouch.clientX - this.left;
      startTop = curTouch.clientY - this.top;
      this.inDraging = true;
    },
    onTouchStart1(e) {
      var curTouch = e.targetTouches[0];
      startLeft = curTouch.clientX - this.left;
      this.inDraging1 = true;
    },
    // 手指在屏幕上滑动事件
    onTouchMove(e) {
      var curTouch = e.targetTouches[0];
      // 相当于两个点的距离公式中 x2-x1 y2-y1
      // var tleft = curTouch.clientX - startLeft;
      var tleft = 0;
      var ttop = curTouch.clientY - startTop;
      // 两点之间的距离函数算出斜边距离
      var distance = getDistance(tleft, ttop, 0, 0);
      // var distance = getDistance(0, ttop, 0, 0);
      // 限制移动范围
      if (distance >= this.ballMoveRadius) distance = this.ballMoveRadius;
      // 移动的夹角Math.atan2 当前坐标移动到目标坐标 之间的夹角
      var angle = Math.atan2(ttop - 0, tleft - 0);
      // 知道夹角和斜边 计算出 两个邻边
      // this.left = Math.cos(angle) * distance;
      this.top = Math.sin(angle) * distance;
      // 斜边移动的角度赋值
      this.stickHeight = distance;
      this.angle = angle;
    },
    onTouchMove1(e) {
      var curTouch = e.targetTouches[0];
      var tleft = curTouch.clientX - startLeft;
      var ttop = 0;
      var distance = getDistance(tleft, ttop, 0, 0);
      if (distance >= this.ballMoveRadius) distance = this.ballMoveRadius;
      var angle = Math.atan2(ttop - 0, tleft - 0);
      this.left = Math.cos(angle) * distance;
      this.stickHeight = distance;
      this.angle = angle;
    },
    // 手指离开事件
    onTouchEnd(e) {
      // 摇杆返回原来位置
      this.stickHeight = this.top = 0;
      this.inDraging = false;
      if (!this.inDraging && !this.inDraging1) this.stop();
    },
    onTouchEnd1(e) {
      this.stickHeight = this.left = 0;
      this.inDraging1 = false;
      if (!this.inDraging && !this.inDraging1) this.stop();
    },
    loop() {
      // 此方法可以将回调函数追加到动画帧请求回调函数列表的末尾。
      // 当执行requestAnimationFrame(callback)时候，不会立刻调用callback函数，只是将其放入队列。
      requestAnimationFrame(this.loop);

      if (this.inDraging || this.inDraging1) {
        var lin = Number((-this.top / 50).toFixed(1));
        var ang = Number((-this.left / 50).toFixed(1));
        this.velocity(lin, ang);
      }
      // else this.stop();
    },
  },
};
</script>

<style lang="scss">
.switchStyle .el-switch__label {
  position: absolute;
  display: none;
  color: #a7a7a7;
}

.switchStyle .el-switch__label--left {
  z-index: 9;
  left: 22px;
  color: #525252;
}

.switchStyle .el-switch__label--right {
  z-index: 9;
  left: -3px;
  color: #ececec;
}

.switchStyle .el-switch__label.is-active {
  display: block;
}

.switchStyle.el-switch .el-switch__core,
.el-switch .el-switch__label {
  width: 55px !important;
  // height: 30px;
}


.joys {
  width: 100%;
  display: flex;
  // align-items: center;
  // justify-content: center;
  justify-content: space-between;
}

.bizhang {
  position: absolute;
  top: 8px;
  left: 15px;
  margin: 10px;
}

.page {
  position: relative;
  width: 35%;
  height: 280px;
  overflow: hidden;
  padding: 40px;
  // margin-left: -75px;
}

div {
  box-sizing: border-box;
}

.toucharea {
  position: absolute;
  z-index: 4;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  box-shadow: 0px 0 20px 1px rgba(155, 227, 255, 0.3), 0px 0 20px 1px rgba(107, 120, 129, 0.3);

}

.ball {
  position: absolute;
  z-index: 3;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  // transition: all 0.2s ease-out;
  box-shadow: 0 0 10px 2px rgba(139, 222, 255, 0.5), 0 0 10px 2px rgba(93, 115, 131, 0.5), 0 0 20px 2px #85f7ff80 inset;

  &:hover {
    transform: translate(-1px, -1px);
    transition: all 0.2s ease-out;
    box-shadow: 0px 0 15px 1px rgba(155, 255, 213, 0.6), 0px 0 15px 1px rgba(107, 129, 116, 0.6);
  }
}

.bian {
  position: absolute;
  width: 250px;
  height: 250px;
  z-index: 99;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.stick {
  position: absolute;
  z-index: 2;
}

.ball.animation {
  transition: left 0.1s ease-out, top 0.1s ease-out;
}

.stick.animation {
  transition: all 0.2s ease-out;
}

.bottom {
  position: absolute;
  z-index: 1;
  transform: translate(-50%, -50%);
}
</style>