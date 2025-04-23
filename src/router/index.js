import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */

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
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
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
    redirect: '/main',
    children: [
      {
        path: 'main',
        component: () => import('@/views/dashboard/index'),
        name: '主選單',
        meta: { title: '主選單', icon: 'component', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
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
    id: 'viewBar',
    path: '/view',
    name: '圖表',
    component: Layout,
    meta: {
      roles: ['admin'],
      title: '圖表',
      icon: 'component'
    },
    children: [
      {
        id: 'viewDashboard',
        path: 'dashboard',
        component: () => import('@/views/dashboard/view'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', roles: ['admin'] }
      }
    ]
  },
  {
    id: 'permissionBar',
    path: '/permission',
    name: '後台管理',
    component: Layout,
    meta: {
      roles: ['admin'],
      title: '後台管理',
      icon: 'lock'
    },
    children: [
      {
        id: 'adminUsers',
        path: 'user',
        component: () => import('@/views/permission/user'),
        name: '後台用戶管理',
        meta: { title: '後台用戶管理', icon: 'user', roles: ['admin'] }
      },
      {
        id: 'permission',
        path: 'index',
        component: () => import('@/views/permission/role'),
        name: '權限管理',
        meta: { title: '權限管理', icon: 'lock', roles: ['admin'] }
      }
    ]
  },
  {
    id: 'userBar',
    path: '/user',
    component: Layout,
    redirect: '/user/page',
    alwaysShow: true, // will always show the root menu
    name: '會員總覽',
    meta: {
      title: '會員總覽',
      icon: 'user',
      roles: ['admin']
    },
    children: [
      {
        id: 'users',
        path: 'users',
        component: () => import('@/views/user/index'),
        name: '會員總覽',
        meta: {
          title: '會員總覽',
          icon: 'user',
          roles: ['admin'],
          noCache: true
        }
      },
      {
        id: 'userInfo',
        path: 'info',
        component: () => import('@/views/user/components/view'),
        name: '會員總覽 > 基本資料',
        meta: {
          title: '基本資料',
          icon: 'user',
          roles: ['admin'],
          noCache: true
        },
        hidden: true
      },
      {
        id: 'riskView',
        path: 'view',
        component: () => import('@/views/risk/view'),
        name: '會員總覽 > 風控限額編輯',
        hidden: true,
        meta: {
          title: '風控限額編輯',
          roles: ['admin']
        }
      },
      {
        id: 'transaction',
        path: '/transaction',
        component: () => import('@/views/transaction/index'),
        name: '交易記錄',
        meta: {
          title: '交易記錄',
          icon: 'el-icon-s-order',
          roles: ['admin'],
          noCache: true
        }
      }
    ]
  },

  {
    id: 'reviewBar',
    path: '/review',
    component: Layout,
    redirect: '/review/cibs', // TODO: 先指向告誡名單，之後改成審核紀錄
    alwaysShow: true, // will always show the root menu
    name: '審核作業',
    meta: {
      title: '審核作業',
      icon: 'list',
      roles: ['admin']
    },

    children: [
      {
        id: 'cibs',
        path: 'cibs',
        component: () => import('@/views/cib/index'),
        name: '告誡名單',
        meta: {
          title: '告誡名單',
          icon: 'el-icon-warning',
          roles: ['admin'],
          noCache: true
        }
      },
      {
        id: 'cibsUpload',
        path: 'cibs/upload',
        component: () => import('@/views/cib/upload'),
        name: '上傳告誡名單',
        hidden: true,
        meta: {
          title: '上傳告誡名單',
          icon: 'el-icon-upload',
          roles: ['admin'],
          noCache: true
        }
      },
      {
        id: 'addresslist',
        path: 'addresslist',
        component: () => import('@/views/whitelist/index'),
        name: '綁定地址',
        meta: {
          title: '綁定地址',
          icon: 'education',
          roles: ['admin'],
          noCache: true
        }
      },
      {
        id: 'addresslistView',
        path: '/addresslist/view',
        component: () => import('@/views/whitelist/components/view'),
        name: '綁定地址編輯',
        hidden: true,
        meta: {
          title: '綁定地址編輯',
          roles: ['admin'],
          noCache: true
        }
      }
    ]
  },

  {
    id: 'riskBar',
    path: '/risk_control',
    component: Layout,
    redirect: '/risk_control/page',
    alwaysShow: true, // will always show the root menu
    name: '風險管理',
    meta: {
      title: '風險管理',
      icon: 'component',
      roles: ['admin']
    },
    children: [
      {
        id: 'riskMemberList',
        path: 'risk_member_list',
        component: () => import('@/views/riskMemberList/index'),
        name: '會員風控管理',
        meta: {
          title: '會員風控管理',
          icon: 'el-icon-warning',
          roles: ['admin']
        }
      },
      {
        id: 'riskControlHistory',
        path: 'history',
        component: () => import('@/views/risk/history'),
        name: '會員風控管理 > 修改紀錄',
        hidden: true,
        meta: {
          title: '風控修改紀錄',
          roles: ['admin']
        }
      },
      {
        id: 'eddList',
        path: 'edd_list',
        component: () => import('@/views/risk/eddList'),
        name: 'EDD名單',
        meta: {
          title: 'EDD名單',
          icon: 'el-icon-warning-outline',
          roles: ['admin']
        }
      }
    ]
  },

  {
    id: 'settingBar',
    path: '/setting',
    component: Layout,
    redirect: '/setting/page',
    alwaysShow: true, // will always show the root menu
    name: '系統參數設定',
    meta: {
      title: '系統參數設定',
      icon: 'el-icon-document',
      roles: ['admin']
    },
    children: [
      {
        id: 'systemSetting',
        path: 'page',
        component: () => import('@/views/setting/index'),
        name: '設定內容',
        meta: {
          title: '設定內容',
          icon: 'el-icon-edit-outline',
          roles: ['admin']
        }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { id: '404', path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
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
