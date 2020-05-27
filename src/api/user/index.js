import request from '@/utils/request'

export function listUser(data, tablePage) {
  return request({
    url: '/user/list',
    method: 'post',
    data: {
      companyName: data.companyName,
      phone: data.phone,
      loginName: data.loginName,
      pageNum: tablePage.pageNumber,
      pageSize: tablePage.pageSize
    }
  })
}

export function deleteUser(data) {
  return request({
    url: '/user/delete',
    method: 'post',
    data: {
      loginName: data
    }
  })
}

export function addUser(data) {
  return request({
    url: '/user/add',
    method: 'post',
    data: {
      loginName: data.loginName,
      password: data.password,
      phone: data.phone,
      companyName: data.companyName,
      admin: data.admin
    }
  })
}

export function editUser(data) {
  return request({
    url: '/user/edit',
    method: 'post',
    data: {
      loginName: data.loginName,
      password: data.password,
      phone: data.phone,
      companyName: data.companyName
    }
  })
}
