import request from '@/utils/request'

export function getTaskList(data) {
  return request({
    url: '/task/list',
    method: 'post',
    data: {
    }
  })
}

export function getTaskDeviceList(data) {
  return request({
    url: '/task/device/list',
    method: 'post',
    data: {
    }
  })
}

