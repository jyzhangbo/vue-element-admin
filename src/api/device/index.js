import request from '@/utils/request'

export function listDeviceAdmin(data, tablePage) {
  return request({
    url: '/device/list/admin',
    method: 'post',
    data: {
      companyName: data.companyName,
      deviceNum: data.deviceNum,
      pageNum: tablePage.pageNumber,
      pageSize: tablePage.pageSize
    }
  })
}

export function listDeviceUser(data, tablePage) {
  return request({
    url: '/device/list/user',
    method: 'post',
    data: {
      deviceName: data.deviceName,
      deviceNum: data.deviceNum,
      pageNum: tablePage.pageNumber,
      pageSize: tablePage.pageSize
    }
  })
}

export function addDevice(data) {
  return request({
    url: '/device/add',
    method: 'post',
    data: {
      companyName: data.companyName,
      deviceNum: data.deviceNum
    }
  })
}

export function deleteDevice(data) {
  return request({
    url: '/device/delete',
    method: 'post',
    data: {
      deviceNum: data
    }
  })
}

export function editDeviceAdmin(data) {
  return request({
    url: '/device/edit/admin',
    method: 'post',
    data: {
      companyName: data.companyName,
      deviceNum: data.deviceNum
    }
  })
}

export function editDeviceUser(data) {
  return request({
    url: '/device/edit/user',
    method: 'post',
    data: {
      img: data.img,
      deviceNum: data.deviceNum,
      deviceName: data.deviceName,
      collectSpace: data.collectSpace,
      attributeInfo: data.attributeInfo
    }
  })
}

