import request from '@/utils/request'

export function getTxVolumnsList(query, token) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/view/tx_volumns',
    method: 'get',
    params: query,
    headers: { token }
  })
}
