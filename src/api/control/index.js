import request from '@/utils/request'

export function controlDevice(listTime) {
  return request({
    url: '/device/control',
    method: 'post',
    data: {
      startTime: listTime.startTime,
      stableTime: listTime.stableTime,
      downTime: listTime.downTime,
      endTime: listTime.endTime,
      taskNum: listTime.deviceNum[0],
      deviceNum: listTime.deviceNum[1],
      startTemp: listTime.startTemp,
      stableTemp: listTime.stableTemp,
      downTemp: listTime.downTemp,
      endTemp: listTime.endTemp
    }
  })
}
