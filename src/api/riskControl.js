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

export function resetRiskControlRole(customer_id, token) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/risk_control/' + customer_id + '/role/reset',
    method: 'patch',
    headers: { token }
  })
}

export function resetRiskControlRoleBatch(customer_ids, token) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/risk_control/role_reset/batch',
    method: 'patch',
    headers: { token },
    data: {
      customer_ids
    }
  })
}

export function updateRiskControlLimit(customer_id, form1, form2, token) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/risk_control/' + customer_id + '/limit',
    method: 'patch',
    headers: { token },
    data: {
      daily_limit: form1.daily_limit,
      monthly_limit: form1.monthly_limit,
      reason: form1.limit_reason,
      ...form2
    }
  }).catch(err => {
    const { response } = err
    if (response) {
      return Promise.reject(response.data)
    }
    return Promise.reject(err)
  })
}
