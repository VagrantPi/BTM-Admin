import request from '@/utils/request'

export function fetchServerLogList(query, token) {
  if (query.date_range) {
    query.start_at = query.date_range[0]
    query.end_at = query.date_range[1]
  }
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/system/server_log',
    method: 'get',
    params: query,
    headers: { token }
  })
}

export function fetchLamassuLogList(query, token) {
  if (query.date_range) {
    query.start_at = query.date_range[0]
    query.end_at = query.date_range[1]
  }
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/system/lamassu_log',
    method: 'get',
    params: query,
    headers: { token }
  })
}

export function downloadServerLog(name, token) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/system/download_log?name=' + name,
    method: 'get',
    headers: { token },
    responseType: 'arraybuffer'
  })
}

export function fetchMockTxLimitLogs(query, token) {
  if (query.date_range) {
    query.start_at = query.date_range[0]
    query.end_at = query.date_range[1]
  }
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/system/mock_tx_limit_logs',
    method: 'get',
    params: query,
    headers: { token }
  })
}
