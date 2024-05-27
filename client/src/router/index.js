import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Layout from '@/layouts';
import mainLayout from '@/layouts/mainLayout';

//基础路由
export const baseRoute = [
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/403',
    component: () => import('@/views/error/403'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/500',
    component: () => import('@/views/error/500'),
    hidden: true
  }
];

export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/components/dataScreen',
    hidden: true,
    children: [
      {
        name: 'PatrolInspection',
        path: '/components/dataScreen',
        component: () => import('@/views/PatrolInspection/index'),
        meta: { title: 'PatrolInspection', icon: 'position', role: ['admin', 'developer', 'custom'] }
      },
      {
        name: 'Setting',
        path: '/components/setting',
        component: () => import('@/views/PatrolInspection/setting'),
        meta: { title: 'Setting', icon: 'position', role: ['admin', 'developer', 'custom'] }
      },
      {
        name: 'userSystem',
        component: mainLayout,
        path: '/userSystem',
        redirect: '/components/device',
        meta: { title: '用户设置', icon: 'user', role: ['admin'] },
        children: [
          // {
          //   name: 'userInfo',
          //   path: '/userSystem/userInfo',
          //   component: () => import('@/views/userSystem/userInfo/index'),
          //   meta: { title: '个人中心' }
          // },
          {
            name: 'setting',
            path: '/userSystem/setting',
            component: () => import('@/views/userSystem/setting/index'),
            meta: { title: '用户设置', role: ['admin'] }
          }
        ]
      },
      {
        name: 'system',
        component: mainLayout,
        path: '/system',
        redirect: '/system/userManage',
        meta: {
          role: ['admin'],
          title: '系统设置',
          icon: 'system'
        },
        children: [
          {
            name: 'userManage',
            path: '/system/userManage',
            component: () => import('@/views/system/userManage/index'),
            meta: { title: '用户管理' }
          },
          {
            name: 'userManage',
            path: '/system/roleManage',
            component: () => import('@/views/system/roleManage/index'),
            meta: { title: '角色管理' }
          }
        ]
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
];

const createRouter = function() {
  return new VueRouter({
    routes: baseRoute,
    scrollBehavior: () => ({ y: 0 })
  });
};

const router = createRouter();

export function resetRouter() {
  router.matcher = createRouter().matcher;
}

//重定向时报错，用这个不让他报错
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err);
};

export default router;
