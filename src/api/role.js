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

// export function addRole(data) {
//   return request({
//     url: '/role',
//     method: 'post',
//     data
//   })
// }

export function updateRole(id, data) {
  return request({
    url: `/role/${id}`,
    method: 'put',
    data
  })
}

// export function deleteRole(id) {
//   return request({
//     url: `/role/${id}`,
//     method: 'delete'
//   })
// }
