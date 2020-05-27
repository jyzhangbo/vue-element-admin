import request from '@/utils/request'

export function getTaskList(data, tablePage) {
  return request({
    url: '/task/list',
    method: 'post',
    data: {
      taskName: data.taskName,
      taskNum: data.taskNum,
      pageNum: tablePage.pageNumber,
      pageSize: tablePage.pageSize

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

