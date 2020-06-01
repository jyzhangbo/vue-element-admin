import request from '@/utils/request'

export function getAlarmRuleList(data) {
  return request({
    url: '/alarm/rule/list',
    method: 'post',
    data: {
      alarmObject: data.alarmObject,
      isEnable: data.state,
      companyName: 'ziru'
    }
  })
}

export function enableAlarmRule(data) {
  return request({
    url: '/alarm/rule/enable',
    method: 'post',
    data: {
      id: data.id,
      isEnable: data.isEnable,
      companyName: 'ziru'
    }
  })
}

export function updateAlarmRule(data) {
  return request({
    url: '/alarm/rule/update',
    method: 'post',
    data: {
      id: data.id,
      judgeValue: data.judgeValue
    }
  })
}

export function getAlarmLogList(data, tablePage) {
  return request({
    url: '/alarm/log/list',
    method: 'post',
    data: {
      alarmObject: data.alarmObject,
      alarmStartTime: data.alarmTime[0],
      alarmEndTime: data.alarmTime[1],
      companyName: 'ziru',
      pageNumber: tablePage.pageNumber,
      pageSize: tablePage.pageSize
    }
  })
}

