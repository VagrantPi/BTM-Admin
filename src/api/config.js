import request from '@/utils/request'

export function getConfig(token) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/config',
    method: 'get',
    headers: { token }
  })
}

export function getConfigLimit(token) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/config/limit',
    method: 'get',
    headers: { token }
  })
}

export function updateConfigLimit(token, data) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/config/limit',
    method: 'patch',
    data,
    headers: { token }
  }).catch(err => {
    const { response } = err
    if (response) {
      return Promise.reject(response.data)
    }
    return Promise.reject(err)
  })
}
