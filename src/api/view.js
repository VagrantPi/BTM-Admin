import request from '@/utils/request'

export function getTxVolumns(token) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/view/tx_volumns',
    method: 'get',
    headers: { token }
  })
}
