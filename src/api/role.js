import request from '@/utils/request'

export function getRoutes(token) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/user/role/routes',
    method: 'get',
    headers: { token }
  })
}

export function getRoles(token) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/user/role/roles',
    method: 'get',
    headers: { token }
  })
}

export function addRole(token, data) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/user/role',
    method: 'post',
    data,
    headers: { token }
  })
}

export function updateRole(token, data) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/user/role',
    method: 'put',
    data,
    headers: { token }
  })
}

// export function deleteRole(id) {
//   return request({
//     url: `/role/${id}`,
//     method: 'delete'
//   })
// }
