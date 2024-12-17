import request from '@/utils/request'

export function login(data) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  console.log('process.env.VUE_APP_BACKEND_URL', process.env.VUE_APP_BACKEND_URL)

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
