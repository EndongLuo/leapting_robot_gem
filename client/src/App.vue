<template>
  <div id="app">
    <keep-alive> <router-view /></keep-alive>
    <!-- <div v-for="i in 5" :key="i" :class="`layer${i}`"></div> -->
  </div>
</template>
<script>

export default {
  name: 'App',
  created() {
    this.$store.dispatch('socket/init');
  },
  activated() {
    console.log(111);
  },
  // methods: {
  //   handleBeforeUnload() {
  //     console.log('beforeunload');
  //     this.socket.removeAllListeners();
  //     this.socket.disconnect()
  //   },
  // },
  // beforeDestroy() {
  //   this.socket.disconnect()
  //   window.removeEventListener('beforeunload', this.handleBeforeUnload);
  //   console.log("destroyed");
  // },
};
</script>
<style lang="scss">
body #app {
  font-size: .2rem;
}

body {
  @function getShadow($n) {
    $shadows: '#{random(100)}vw #{random(100)}vh #fff';

    @for $i from 2 through $n {
      $shadows: #{$shadows}, #{random(100)}px #{random(100)}px #fff;
    }

    @return unquote($shadows);
  }

  $duration: 400s;
  $count: 1000;

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
}
</style>
