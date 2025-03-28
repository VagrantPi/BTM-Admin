import request from '@/utils/request'
import axios from 'axios'

export function fetchList(query, token) {
  if (query.date_range) {
    query.white_list_date_start = query.date_range[0]
    query.white_list_date_end = query.date_range[1]
  } else {
    query.white_list_date_start = undefined
    query.white_list_date_end = undefined
  }
  if (query.customer_date_range) {
    query.customer_date_start = query.customer_date_range[0]
    query.customer_date_end = query.customer_date_range[1]
  } else {
    query.customer_date_start = undefined
    query.customer_date_end = undefined
  }
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/customer/list',
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

export function getCustomerDetail(customer_id, token) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/customer/' + customer_id + '/detail',
    method: 'get',
    headers: { token }
  })
}

export function getSumsubImage(query, token) {
  return axios({
    url: process.env.VUE_APP_BACKEND_URL + '/api/customer/image',
    method: 'get',
    params: query,
    headers: { token },
    responseType: 'blob'
  })
}
