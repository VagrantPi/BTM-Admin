import request from '@/utils/request'

export function fetchTxList(query, token) {
  if (query.date_range) {
    query.date_start = query.date_range[0]
    query.date_end = query.date_range[1]
  }
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/tx/list',
    method: 'get',
    params: query,
    headers: { token }
  })
}
