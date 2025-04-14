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

export function updateRiskControlRole(customer_id, form, token) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/risk_control/' + customer_id + '/role',
    method: 'patch',
    headers: { token },
    data: {
      role_id: form.role,
      reason: form.reason
    }
  })
}

export function updateRiskControlLimit(customer_id, form, token) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/risk_control/' + customer_id + '/limit',
    method: 'patch',
    headers: { token },
    data: {
      daily_limit: form.daily_limit,
      monthly_limit: form.monthly_limit,
      reason: form.limit_reason
    }
  }).catch(err => {
    const { response } = err
    if (response) {
      return Promise.reject(response.data)
    }
    return Promise.reject(err)
  })
}

export function updateRiskControlEdd(customer_id, form, token) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/risk_control/' + customer_id + '/edd',
    method: 'patch',
    headers: { token },
    data: {
      ...form
    }
  }).catch(err => {
    const { response } = err
    if (response) {
      return Promise.reject(response.data)
    }
    return Promise.reject(err)
  })
}
