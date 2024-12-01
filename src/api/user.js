import request from '@/utils/request'

export function login(data) {
  console.log('process.env.VUE_APP_BASE_API', process.env.VUE_APP_BASE_API)
  console.log('process.env.ENV', process.env.ENV)
  return request({
    url: 'http://127.0.0.1:8080/api/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: 'http://127.0.0.1:8080/api/user/info',
    method: 'get',
    headers: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
