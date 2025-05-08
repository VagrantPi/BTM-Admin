import request from '@/utils/request'

export function fetchSumsubInfo(customer_id, server_key) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/tool/sumsub/' + customer_id,
    method: 'get',
    headers: { token: server_key }
  })
}

export function syncAllSumsubData(forceSync, server_key) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/tool/sync_sumsub',
    method: 'post',
    headers: { token: server_key },
    params: { force: forceSync }
  })
}

export function getSmsHistory(date_at, limit, server_key) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/tool/sms_history',
    method: 'get',
    headers: { token: server_key },
    params: { date_at, limit }
  })
}

export function resendReceipt(session_id, server_key) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/tool/resend_receipt/' + session_id,
    method: 'post',
    headers: { token: server_key }
  })
}
