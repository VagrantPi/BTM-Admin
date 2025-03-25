import { asyncRoutes, constantRoutes } from '@/router'
import { getRoles } from '@/api/role'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}
// eslint-disable-next-line no-unused-vars
function removeComponentProperty(routes) {
  return routes.map(route => {
    const newRoute = { ...route }
    delete newRoute.component
    delete newRoute.alwaysShow

    if (newRoute.children && Array.isArray(newRoute.children)) {
      newRoute.children = removeComponentProperty(newRoute.children)
    }

    return newRoute
  })
}

function updateTreeRoles(markTree, fullTree, role) {
  // 遞迴函數用於遍歷標記樹並更新完整路由樹
  function traverse(markNode, fullNode) {
    // 如果當前節點存在，且 markNode 的 id 存在
    if (markNode && markNode.id) {
      // 在完整路由樹中找到對應的節點
      const matchedFullNode = fullNode.find(node => node.id === markNode.id)

      if (matchedFullNode) {
        // 如果目標節點尚未包含 'edit' 角色，則添加
        if (!matchedFullNode.meta) {
          matchedFullNode.meta = { roles: [`${role}`] }
        } else if (!matchedFullNode.meta.roles) {
          matchedFullNode.meta.roles = [`${role}`]
        } else if (!matchedFullNode.meta.roles.includes(`${role}`)) {
          matchedFullNode.meta.roles.push(`${role}`)
        }
      }

      // 遞迴處理子節點
      if (markNode.children && markNode.children.length > 0) {
        markNode.children.forEach(childMarkNode => {
          // 對於每個子節點，在所有 fullNode 的子節點中查找
          const matchedFullChildren = fullNode.filter(node =>
            node.children && node.children.some(child => child.id === childMarkNode.id)
          )

          if (matchedFullChildren.length > 0) {
            matchedFullChildren.forEach(fullParentNode => {
              // 遞迴調用，傳入子節點
              traverse(childMarkNode, fullParentNode.children)
            })
          }
        })
      }
    }
  }

  // 從根節點開始遍歷
  markTree.forEach(markNode => {
    traverse(markNode, fullTree)
  })

  // 返回更新後的完整路由樹
  return fullTree
}

const actions = {
  generateRoutes({ commit }, roles) {
    // DEBUG 用，使用完後請註解
    // console.log('all asyncRoutes:', JSON.stringify(removeComponentProperty(asyncRoutes)))
    // console.log('roles', roles)
    return new Promise(resolve => {
      getRoles(this.state.user.token).then(res => {
        const _roles = res.data
        const filteredRoles = _roles.filter(it => roles.includes(it.role_name))
        const _asyncRoutes = JSON.parse(filteredRoles[0].role_raw)

        let accessedRoutes
        const roleAsncyRoutes = updateTreeRoles(_asyncRoutes, asyncRoutes, roles[0])

        if (roles.includes('admin')) {
          accessedRoutes = roleAsncyRoutes || []
        } else {
          accessedRoutes = filterAsyncRoutes(roleAsncyRoutes, roles)
        }
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
