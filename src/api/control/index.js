import request from '@/utils/request'

export function controlDevice(listTime, deviceNum, type) {
  return request({
    url: '/device/control',
    method: 'post',
    data: {
      deviceNum: deviceNum,
      modelType: listTime.modelType,
      tapControl1: listTime.tapControl1,
      tapControl2: listTime.tapControl2,
      probeType1: listTime.probeType1,
      probeType2: listTime.probeType2,
      tempControl: listTime.tempControl,
      type: type,
      manualControl1: listTime.manualControl1,
      manualControl2: listTime.manualControl2
    }
  })
}

export function getDeviceControlInfo(deviceNum) {
  return request({
    url: '/device/control/info/query',
    method: 'post',
    data: {
      deviceNum: deviceNum
    }
  })
}
