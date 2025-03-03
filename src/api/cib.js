import request from '@/utils/request'

export function fetchCibList(query, token) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/cib/list',
    method: 'get',
    params: query,
    headers: { token }
  })
}
