import request from '@/utils/request'

export function listImg() {
  return request({
    url: '/base/list/img',
    method: 'post',
    data: {
    }
  })
}

export function removeImg(data) {
  return request({
    url: '/base/remove/img',
    method: 'post',
    data: {
      url: data
    }
  })
}

