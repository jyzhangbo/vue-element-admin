import request from '@/utils/request'

export function listCompanyName(data) {
  return request({
    url: '/base/list/companyName',
    method: 'post',
    data: {
    }
  })
}

export function listTaskDevice(data) {
  return request({
    url: '/base/list/task/device',
    method: 'post',
    data: {
    }
  })
}
