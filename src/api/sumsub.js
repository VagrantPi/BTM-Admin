import request from '@/utils/request'

export function getReviewHistory(token, applicant_id) {
  return request({
    url: process.env.VUE_APP_BACKEND_URL + '/api/3rd/v1/sumsub/' + applicant_id + '/review_history',
    method: 'get',
    headers: { token }
  })
}
