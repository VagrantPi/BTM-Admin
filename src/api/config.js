import request from '@/utils/request'

export function getConfig(token) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/config',
    method: 'get',
    headers: { token }
  })
}
