import request from '@/utils/request'

export function queryData(listTime) {
  return request({
    url: '/data/query',
    method: 'post',
    data: {
    }
  })
}

export function queryTableData() {
  return request({
    url: '/data/query/table',
    method: 'post',
    data: {
    }
  })
}

