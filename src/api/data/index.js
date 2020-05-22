import request from '@/utils/request'

export function queryData(listTime) {
  return request({
    url: '/data/query',
    method: 'post',
    data: {
    }
  })
}

