import request from '@/utils/request'
import axios from 'axios'

export function fetchList(query, token) {
  const newQuery = { ...query }
  if (newQuery.date_range) {
    newQuery.white_list_date_start = newQuery.date_range[0]
    newQuery.white_list_date_end = newQuery.date_range[1]
  } else {
    newQuery.white_list_date_start = undefined
    newQuery.white_list_date_end = undefined
  }
  if (newQuery.customer_date_range) {
    newQuery.customer_date_start = newQuery.customer_date_range[0]
    newQuery.customer_date_end = newQuery.customer_date_range[1]
  } else {
    newQuery.customer_date_start = undefined
    newQuery.customer_date_end = undefined
  }
  if (!!newQuery && !!newQuery.phone) {
    newQuery.query = newQuery.phone.trim()
  }
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/customer/list',
    method: 'get',
    params: newQuery,
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

export function addCustomerNote(customer_id, data, token) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/customer/' + customer_id + '/note',
    method: 'post',
    data,
    headers: { token }
  })
}

export function getCustomerNotes(query, customer_id, token) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/customer/' + customer_id + '/notes',
    method: 'get',
    params: query,
    headers: { token }
  })
}
