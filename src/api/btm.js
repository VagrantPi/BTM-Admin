import request from '@/utils/request'

export function getChangeLogs(query, token) {
  if (query.date_range) {
    query.start_at = query.date_range[0]
    query.end_at = query.date_range[1]
  }
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/btm/logs',
    method: 'get',
    params: query,
    headers: { token }
  })
}
