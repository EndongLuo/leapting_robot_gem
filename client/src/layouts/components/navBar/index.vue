<template>
  <div class="nav-wrapper flex justify-between align-center">
    <a-icon
      :type="collapsed ? 'menu-fold' : 'menu-unfold'"
      class="nav-fold boxHover"
      @click="toggleOpen"
      v-show="!horizontal"
    />

    <bread-crumb v-show="!horizontal" />

    <div class="right-menu flex">
      <a-tooltip placement="bottom">
        <template slot="title">
          主题配置
        </template>
        <div class="right-menu-item pointer boxHover" @click="changeVisible">
          <svg-icon icon="color" :size="18" />
        </div>
      </a-tooltip>

      <div class="right-menu-item pointer boxHover" style="margin-right:15px" @click="toNotice">
        <a-badge :count="count" :overflow-count="99" :offset="[3, -4]">
          <svg-icon icon="bell" :size="18" />
        </a-badge>
      </div>
      <nav-user class="right-menu-item pointer boxHover flex-sub" />
    </div>
  </div>
</template>

<script>
import navUser from './navUser';
import breadCrumb from './breadCrumb';
export default {
  name: 'navBar',
  props: {
    collapsed: {
      type: Boolean,
      default: true
    },
    horizontal: {
      type: Boolean,
      default: false
    }
  },
  components: { navUser, breadCrumb },
  data() {
    return {
      breadList: [
        {
          path: '/dashboard',
          meta: { title: '首页', icon: 'dashboard' }
        }
      ],
      count: 0,
      isFullscreen: false
    };
  },
  methods: {
    toggleOpen() {
      this.$store.commit('setting/TOGGLE_OPEN');
    },
    changeVisible() {
      this.$store.dispatch('setting/changeVisible', true);
    },
    toNotice() {
      this.count = 0;
      this.$router.push({
        name: 'userInfo',
        params: {
          key: 'noticePage'
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.nav-wrapper {
  height: 54px;
  overflow: hidden;
  position: relative;
  background: #fff;
  -webkit-box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .boxHover {
    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }
  .nav-fold {
    padding: 0 18px;
    height: 100%;
    cursor: pointer;
    font-size: 20px;
    line-height: 58px;
    transition: all 0.3s, padding 0s;
  }

  .right-menu {
    height: 100%;
    width: 280px;
    .right-menu-item {
      height: 100%;
      padding: 0 8px;
      line-height: 54px;
    }
  }
}
</style>
