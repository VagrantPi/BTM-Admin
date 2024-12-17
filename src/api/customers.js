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
