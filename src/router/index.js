import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'dashboard',
        meta: { title: '首页', icon: 'dashboard', noCache: true }
      }
    ]
  },
  {
    path: '/task',
    component: Layout,
    redirect: '/task/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/task/index'),
        name: '任务管理',
        meta: { title: '任务管理', icon: 'task', noCache: true }
      }
    ]
  },
  {
    path: '/data',
    component: Layout,
    redirect: '/data/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/data/index'),
        name: '数据查询',
        meta: { title: '数据查询', icon: 'data', noCache: true }
      }
    ]
  },
  {
    path: '/alarm',
    component: Layout,
    redirect: '/alarm/alarm-rule',
    name: '告警管理',
    alwaysShow: true,
    meta: {
      title: '告警管理',
      icon: 'alarm'
    },
    children: [
      {
        path: 'alarm-rule',
        component: () => import('@/views/alarm/alarm-rule'),
        name: '告警规则',
        meta: { title: '告警规则', icon: 'alarm', noCache: true }
      },
      {
        path: 'alarm-list',
        component: () => import('@/views/alarm/alarm-list'),
        name: '告警列表',
        meta: { title: '告警列表', icon: 'alarm', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/user/index'),
        name: '用户管理',
        meta: {
          title: '用户管理',
          icon: 'user',
          noCache: true,
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/picture',
    component: Layout,
    redirect: '/picture/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/picture/index'),
        name: '图片管理',
        meta: {
          title: '图片管理',
          icon: 'picture',
          noCache: true,
          roles: ['userAdmin']
        }
      }
    ]
  },
  {
    path: '/simulation',
    component: Layout,
    redirect: '/simulation/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/simulation/index'),
        name: '编辑数据',
        meta: {
          title: '编辑数据',
          icon: 'simulation',
          noCache: true,
          roles: ['userAdmin']
        }
      }
    ]
  },
  {
    path: '/control',
    component: Layout,
    redirect: '/control/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/control/index'),
        name: '温度控制',
        meta: {
          title: '温度控制',
          icon: 'control',
          noCache: true,
          roles: ['userAdmin']
        }
      }
    ]
  },
  {
    path: '/device',
    component: Layout,
    redirect: '/device/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/device/index'),
        name: '设备录入',
        meta: {
          title: '设备录入',
          icon: 'device',
          noCache: true,
          roles: ['admin']
        }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
