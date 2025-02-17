import request from '@/utils/request'

export function fetchTxList(query, token) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/tx/' + query.customer_id + '/list',
    method: 'get',
    params: query,
    headers: { token }
  })
}
