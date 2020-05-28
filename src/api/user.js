import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      userName: data.username,
      password: data.password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'post',
    data: {
      token: token
    }
  })
}

export function logout(token) {
  return request({
    url: '/user/logout',
    method: 'post',
    data: {
      token: token
    }
  })
}
