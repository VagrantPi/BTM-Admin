import request from '@/utils/request'

export function fetchList(query, token) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/customer/list',
    method: 'get',
    params: query,
    headers: { token }
  })
}

export function searchList(query, token) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/customer/search',
    method: 'get',
    params: query,
    headers: { token }
  })
}

export function searchListByDate(query, token) {
  if (query.date_range) {
    query.date_start = query.date_range[0]
    query.date_end = query.date_range[1]
  }
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/customer/search/whitelist_created_at',
    method: 'get',
    params: query,
    headers: { token }
  })
}

export function searchListByAddress(query, token) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/customer/search/address/' + query.address,
    method: 'get',
    params: query,
    headers: { token }
  })
}

export function fetchWhiteList(query, token) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/customer/whitelist',
    method: 'get',
    params: query,
    headers: { token }
  })
}

export function createWhiteList(data, token) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/customer/whitelist',
    method: 'post',
    data,
    headers: { token }
  })
}

export function deleteWhiteList(id, token) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/customer/whitelist',
    method: 'delete',
    data: { id },
    headers: { token }
  })
}

export function searchWhiteList(query, token) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/customer/whitelist/search',
    method: 'get',
    params: query,
    headers: { token }
  })
}
