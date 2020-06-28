import request from '@/utils/request'

export function controlDevice(listTime) {
  return request({
    url: '/device/control',
    method: 'post',
    data: {
      startTemp: listTime.startTemp,
      startTime: listTime.startTime,
      upSpeed: listTime.upSpeed,
      constantTemp: listTime.constantTemp,
      constantTime: listTime.constantTime,
      downSpeed: listTime.downSpeed,
      endTemp: listTime.endTemp,
      taskNum: listTime.deviceNum[0],
      deviceNum: listTime.deviceNum[1]
    }
  })
}
