import request from '@/utils/request'

export function listTask(data, tablePage) {
  return request({
    url: '/task/list',
    method: 'post',
    data: {
      taskName: data.taskName,
      taskNum: data.taskNum,
      pageNum: tablePage.pageNumber,
      pageSize: tablePage.pageSize,
      taskState: data.taskState
    }
  })
}

export function listDeviceTask(data) {
  return request({
    url: '/device/list/task',
    method: 'post',
    data: {
      taskNum: data
    }
  })
}

export function editTask(data) {
  return request({
    url: '/task/edit',
    method: 'post',
    data: {
      taskNum: data.taskNum,
      devices: data.deviceNums,
      state: data.state,
      taskName: data.taskName,
      companyName: data.companyName
    }
  })
}

export function addTask(data) {
  return request({
    url: '/task/add',
    method: 'post',
    data: {
      taskNum: data.taskNum,
      devices: data.deviceNums,
      taskName: data.taskName
    }
  })
}

export function deleteTask(data) {
  return request({
    url: '/task/delete',
    method: 'post',
    data: {
      taskNum: data.taskNum,
      companyName: data.companyName
    }
  })
}

