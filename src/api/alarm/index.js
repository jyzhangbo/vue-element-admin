import request from '@/utils/request'

export function getAlarmRuleList(data) {
  return request({
    url: '/alarm/rule/list',
    method: 'post',
    data: {
      alarmObject: data.alarmObject,
      state: data.state
    }
  })
}

export function getAlarmList(data) {
  return request({
    url: '/alarm/list',
    method: 'post',
    data: {
      alarmObject: data.alarmObject,
      alarmTime: data.alarmTime
    }
  })
}

