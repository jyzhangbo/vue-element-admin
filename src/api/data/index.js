import request from '@/utils/request'

export function queryData(data) {
  return request({
    url: '/data/query/char',
    method: 'post',
    data: {
      startTime: data.startTime,
      endTime: data.endTime,
      taskNum: data.deviceNum[0],
      deviceNum: data.deviceNum[1]
    }
  })
}

export function queryTableData(data) {
  return request({
    url: '/data/query/table',
    method: 'post',
    data: {
      startTime: data.startTime,
      endTime: data.endTime,
      taskNum: data.deviceNum[0],
      deviceNum: data.deviceNum[1]
    }
  })
}

