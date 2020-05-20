import request from '@/utils/request'

export function getDeviceList(data) {
  return request({
    url: '/device/list',
    method: 'post',
    data: {
      companyName: data.companyName,
      deviceNum: data.deviceNum
    }
  })
}

