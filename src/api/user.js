import request from '@/utils/request'

export function login(data) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/user/info',
    method: 'get',
    headers: { token }
  })
}

export function logout(token) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/user/logout',
    method: 'post',
    headers: { token }
  })
}

export function userList(query, token) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/user/list',
    method: 'get',
    params: query,
    headers: { token }
  })
}

export function userListLite(token) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/user/list/lite',
    method: 'get',
    headers: { token }
  })
}

export function userCreate(token, data) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/user/one',
    method: 'post',
    data,
    headers: { token }
  })
}

export function userUpdate(token, data) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/user/one',
    method: 'put',
    data,
    headers: { token }
  })
}
