import request from '@/utils/request'

export function queryData(data) {
  return request({
    url: '/data/query/char',
    method: 'post',
    data: {
      startTime: data.startTime,
      endTime: data.endTime,
      taskNum: data.deviceNum[0],
      deviceNum: data.deviceNum[1]
    }
  })
}

export function queryTableData(data, tablePage) {
  return request({
    url: '/data/query/table',
    method: 'post',
    data: {
      startTime: data.startTime,
      endTime: data.endTime,
      taskNum: data.deviceNum[0],
      deviceNum: data.deviceNum[1],
      pageNum: tablePage.pageNumber,
      pageSize: tablePage.pageSize
    }
  })
}

export function simulationData(listTime, listTemp) {
  return request({
    url: '/data/simulation',
    method: 'post',
    data: {
      startTime: listTime.startTime,
      stableTime: listTime.stableTime,
      downTime: listTime.downTime,
      endTime: listTime.endTime,
      taskNum: listTime.deviceNum[0],
      deviceNum: listTime.deviceNum[1],
      timeSpace: listTime.timeSpace,
      randomTime: listTime.randomTime,
      listTemp: listTemp
    }
  })
}

export function changeData(data, listTime) {
  return request({
    url: '/data/change',
    method: 'post',
    data: {
      taskNum: listTime.deviceNum[0],
      deviceNum: listTime.deviceNum[1],
      time: data.time,
      values: data.values
    }
  })
}

export function copyData(data, listTime) {
  return request({
    url: '/data/copy',
    method: 'post',
    data: {
      taskNum: listTime.deviceNum[0],
      deviceNum: listTime.deviceNum[1],
      fromAttr: data.fromAttr,
      toAttr: data.toAttr,
      addData: data.addData,
      randomData: data.randomData,
      startTime: listTime.startTime,
      endTime: data.endTime
    }
  })
}

export function exportExcel(query) {
  const data = {
    startTime: query.startTime,
    endTime: query.endTime,
    taskNum: query.deviceNum[0],
    deviceNum: query.deviceNum[1]
  }
  window.location.href = 'https://localhost:8080/data/export/excel?param=' + encodeURIComponent(JSON.stringify(data), 'utf-8')
}
