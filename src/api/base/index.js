import request from '@/utils/request'

export function listCompanyName(data) {
  return request({
    url: '/base/list/companyName',
    method: 'post',
    data: {
    }
  })
}

