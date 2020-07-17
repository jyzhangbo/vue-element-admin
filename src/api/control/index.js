import request from '@/utils/request'

export function controlDevice(listTime, deviceNum) {
  return request({
    url: '/device/control',
    method: 'post',
    data: {
      taskNum: deviceNum.deviceNum[0],
      deviceNum: deviceNum.deviceNum[1],
      modelType: listTime.modelType,
      tapControl1: listTime.tapControl1,
      tapControl2: listTime.tapControl2,
      probeType1: listTime.probeType1,
      probeType2: listTime.probeType2,
      tempControl: listTime.tempControl
    }
  })
}

export function getDeviceControlInfo(deviceNum) {
  return request({
    url: '/device/control',
    method: 'post',
    data: {
      deviceNum: deviceNum
    }
  })
}
