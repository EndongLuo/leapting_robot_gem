<template>
  <div class="maps">
    <!-- 地图 -->
    <Map_canvas :initialpose="initialpose" @change="change" />
    <!-- <div style="display: none;">{{ notify }}}</div> -->
    <!-- 左侧 -->
    <div class="map_left">
      <div class="left_list">
        <div class="l_icon">
          <!-- <span title="急停" @click="Pause"><i class="el-icon-video-pause" style="color: #F56C6C;"></i></span> -->
          <!-- <img @click="Pause" style="width: 0.3rem;height: 0.3rem;" src="../../../public/img/Stop.png" alt="" /> -->
          <span title="重定位" @click="initpose"><i class="el-icon-map-location"></i></span>
          <!-- <span title="暂停" @click="Pause" v-if="!flexbeSwitch"><i class="el-icon-video-pause" style="color: #F56C6C"></i></span>
          <span title="继续" @click="Pause" v-else><i class="el-icon-video-play" style="color: #67C23A"></i></span>
          <span title="光伏尺寸" @click="PVSize"><i class="el-icon-edit-outline" ></i></span>
          <span title="修改图层" @click="trimLayer"><i class="el-icon-copy-document" ></i></span>
          <span title="视图" @click="viewLayers"><i class="el-icon-view"></i></span> -->


        </div>
      </div>
    </div>

  </div>
</template>

<script>
import Map_canvas from "@/components/Map_canvas";

export default {
  components: { Map_canvas, },
  data() {
    return {
      flexbeSwitch: false,
      flag: false,
      isShow: false,
      isShowArm: false,
      isDraw: false,
      initialpose: false,
      notifyPromise: Promise.resolve(),
      dialogFormVisible: false,
      pvSize: {
        length: 0,
        width: 0
      },
      formLabelWidth: '120px'
    };
  },
  methods: {
    initpose() {
      this.initialpose = true;
      this.$message('Initial Pose');
    },
    // 暂停
    // Pause() {
    //   //自定义事件  传递值“子向父组件传值”
    //   this.$emit("Pause");
    //   this.$message('Pause');
    // },
    change(value) {
      // console.log(Boolean(value));
      this.initialpose =Boolean(value) 
    }
  }
};
</script>

<style scoped lang="scss">
.maps {
  width: 100%;
  // height: 85vh;
  margin-top: 5px;
  position: relative;
  // background: #fff;

  // border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;

  .map_left,
  .map_right {
    position: absolute;
    opacity: 0.8;
    background: #000;
    top: 8%;
    width: .33rem;
    // border-radius: 0 10px 10px 0;
    border-radius: 10px;
    // padding: 0.1rem 0;
    left: .05rem;
    font-size: .2rem;
    z-index: 1000;

    .left_list {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-shadow: 0 2px 2px 0px rgba(0, 0, 0, 0.1);

      .l_icon {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        font-size: .3rem;
        line-height: 1.2;
        cursor: pointer;

        // img {
        //   max-width: 80%;
        //   height: auto;
        //   margin: 0 auto !important;
        // }
        img{
          width: 100%;
          &:hover{
            background: #ffffff;
            border-radius: 50%;
          }
        } 

        span {
          opacity: 1;
          color: #dddddd;

          &:hover {
            opacity: 0.7;
          }
        }
      }
    }
  }

  .map_right {
    right: 0;
    border-radius: 10px 0 0 10px;
  }
}</style>
