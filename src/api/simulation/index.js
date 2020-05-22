import request from '@/utils/request'

export function simulationData(listTime, listTemp) {
  return request({
    url: '/data/simulation',
    method: 'post',
    data: {
      startTime: listTime.startTime,
      stableTime: listTime.stableTime,
      downTime: listTime.downTime,
      endTime: listTime.endTime
    }
  })
}

