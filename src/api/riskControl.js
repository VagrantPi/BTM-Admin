import request from '@/utils/request'

export function fetchRiskControlRoleList(token) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/risk_control/roles',
    method: 'get',
    headers: { token }
  })
}

export function fetchRiskControlRole(customer_id, token) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/risk_control/' + customer_id + '/role',
    method: 'get',
    headers: { token }
  })
}

export function updateRiskControlRole(customer_id, role_id, token) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/risk_control/' + customer_id + '/role',
    method: 'patch',
    headers: { token },
    data: {
      role_id
    }
  })
}

export function updateRiskControlLimit(customer_id, daily_limit, monthly_limit, token) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/risk_control/' + customer_id + '/limit',
    method: 'patch',
    headers: { token },
    data: {
      daily_limit,
      monthly_limit
    }
  }).catch(err => {
    const { response } = err
    if (response) {
      return Promise.reject(response.data)
    }
    return Promise.reject(err)
  })
}
