import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/customer/list',
    method: 'get',
    params: query
  })
}

export function searchList(query) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/customer/search',
    method: 'get',
    params: query
  })
}

export function fetchWhiteList(query) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/customer/whitelist',
    method: 'get',
    params: query
  })
}

export function createWhiteList(data) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/customer/whitelist',
    method: 'post',
    data
  })
}

export function deleteWhiteList(id) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/customer/whitelist',
    method: 'delete',
    data: { id }
  })
}

export function searchWhiteList(query) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/customer/whitelist/search',
    method: 'get',
    params: query
  })
}
