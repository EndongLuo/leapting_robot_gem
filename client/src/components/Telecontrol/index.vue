<template>
  <div>
    <div class="joy">
      <joy :velocity="velocity" :stop="stop" :PTZURL="PTZURL" />
    </div>
  </div>
</template>

<script>
import joy from "@/components/Telecontrol/joy.vue";

export default {
  props: ['IP', 'PTZURL'],
  components: { joy },
  name: "CarControl",
  methods: {
    // 底盘车控制
    velocity(lin = 0, ang = 0) {
      console.log("线速度：", lin, '---角速度：', ang);
      var axes = [0, lin, 0.5, ang, 0, 1.0, 0, 0];

      this.$store.dispatch("socket/control", { ip: this.IP, axes });
    },
    stop() {
      console.log("底盘停止");
      var axes = [0, 0, 1.0, 0, 0, 1.0, 0, 0];
      this.$store.dispatch("socket/control", { ip: this.IP, axes });
    },
  },
};
</script>

<style lang="scss" scoped>
.joy {
  display: flex;
  align-items: center;
}

.page {
  margin-top: 30px;
  // display: flex;
}
</style>