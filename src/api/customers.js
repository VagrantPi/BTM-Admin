import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'http://127.0.0.1:8081/api/customer/list',
    method: 'get',
    params: query
  })
}

export function fetchWhiteList(query) {
  return request({
    url: 'http://127.0.0.1:8081/api/customer/whitelist',
    method: 'get',
    params: query
  })
}

export function createWhiteList(data) {
  return request({
    url: 'http://127.0.0.1:8081/api/customer/whitelist',
    method: 'post',
    data
  })
}

export function deleteWhiteList(id) {
  return request({
    url: 'http://127.0.0.1:8081/api/customer/whitelist',
    method: 'delete',
    data: { id }
  })
}
