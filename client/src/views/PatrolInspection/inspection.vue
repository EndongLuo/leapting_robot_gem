<template>
  <div class="myVideo-video">
    <div slot="body" class="container offset-bottom" style="display: flex; width: 100%;">
      <div style="height:100%; width: 50%;">
        <iframe :src="PTZURL.h" style="height:2.36rem; width:100%;margin:0;border:0;" frameborder="0" scrolling="no">
        </iframe>
      </div>
      <div style="height:100%; width: 50%;">
        <iframe :src="PTZURL.k" style="height:2.36rem; width:100%;margin:0;border:0;" frameborder="0" scrolling="no">
        </iframe>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:['PTZURL'],
  data() {
    return {
    }
  },
  mounted(){
  }

}
</script>

<style lang="scss" scoped>
.myVideo-video {
  display: flex;
  width: 100%;
  height: 300px;

  video {
    // border: 1px solid #000;
    margin-top: -60px;
    width: 50%;
    height: 100%;
  }
}
</style>
