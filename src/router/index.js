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
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
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
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: 'Permission',
      icon: 'lock',
      roles: ['admin'] // you can set roles in root nav
    },
    children: [
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: 'Role Permission',
          roles: ['admin']
        }
      }
    ]
  },

  {
    path: '/risk_control',
    component: Layout,
    redirect: '/risk_control/page',
    alwaysShow: true, // will always show the root menu
    name: '風控',
    meta: {
      title: '風控',
      icon: 'list',
      roles: ['admin'] // you can set roles in root nav
    },
    children: [
      {
        path: 'whitelist',
        component: () => import('@/views/riskWhitelist/index'),
        name: '風控白名單',
        meta: {
          title: '風控白名單',
          icon: 'eye-open'
        }
      },
      {
        path: 'whitelist/view',
        component: () => import('@/views/riskWhitelist/components/view'),
        name: '風控白名單限額編輯',
        hidden: true,
        meta: {
          title: '風控白名單限額編輯'
        }
      },
      {
        path: 'graylist',
        component: () => import('@/views/riskGraylist/index'),
        name: '風控灰名單',
        meta: {
          title: '風控灰名單',
          icon: 'eye',
          roles: ['admin']
        }
      },
      {
        path: 'graylist/view',
        component: () => import('@/views/riskGraylist/components/view'),
        name: '風控灰名單限額編輯',
        hidden: true,
        meta: {
          title: '風控灰名單限額編輯'
        }
      },
      {
        path: 'blacklist',
        component: () => import('@/views/riskBlacklist/index'),
        name: '風控黑名單',
        meta: {
          title: '風控黑名單',
          icon: 'password',
          roles: ['admin']
        }
      },
      {
        path: 'blacklist/view',
        component: () => import('@/views/riskBlacklist/components/view'),
        name: '風控黑名單限額編輯',
        hidden: true,
        meta: {
          title: '風控黑名單限額編輯'
        }
      }
    ]
  },

  {
    path: '/whitelist',
    component: Layout,
    meta: { roles: ['admin', 'editor'] },
    children: [{
      path: 'index',
      component: () => import('@/views/whitelist/index'),
      name: '綁定帳戶',
      meta: {
        title: '綁定帳戶',
        icon: 'education',
        roles: ['admin', 'editor'],
        noCache: true
      }
    },
    {
      path: '/whitelist/view',
      component: () => import('@/views/whitelist/components/view'),
      name: '綁定帳戶編輯',
      hidden: true,
      meta: {
        title: '綁定帳戶編輯',
        roles: ['admin', 'editor'],
        noCache: true
      }
    }]
  },

  {
    path: '/transaction',
    component: Layout,
    meta: { roles: ['admin', 'editor'] },
    children: [{
      path: 'index',
      component: () => import('@/views/transaction/index'),
      name: '交易記錄',
      meta: {
        title: '交易記錄',
        icon: 'el-icon-s-order',
        roles: ['admin', 'editor'],
        noCache: true
      }
    }]
  },

  {
    path: '/cibs',
    component: Layout,
    meta: { roles: ['admin', 'editor'] },
    children: [{
      path: 'index',
      component: () => import('@/views/cib/index'),
      name: '告誡名單',
      meta: {
        title: '告誡名單',
        icon: 'el-icon-warning',
        roles: ['admin', 'editor'],
        noCache: true
      }
    }]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
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
