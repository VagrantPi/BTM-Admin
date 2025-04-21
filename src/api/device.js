import request from '@/utils/request'

export function getDeviceList(token) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/view/device_list',
    method: 'get',
    headers: { token }
  })
}
