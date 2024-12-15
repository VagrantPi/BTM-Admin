import request from '@/utils/request'

export function getConfig() {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/config',
    method: 'get'
  })
}
