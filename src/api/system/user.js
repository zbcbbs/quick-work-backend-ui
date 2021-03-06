import request from '@/utils/request'
import { encrypt } from '@/utils/rsaEncrypt'
import qs from 'qs'

export function add(data) {
  return request({
    url: 'api/users',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/users/' + ids,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/users',
    method: 'put',
    data
  })
}

// 修改用户状态
export function updateStatus(data) {
  return request({
    url: 'api/users/updateStatus',
    method: 'put',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data)
  })
}

export function updatePass(user) {
  const data = {
    oldPass: encrypt(user.oldPass),
    newPass: encrypt(user.newPass)
  }
  return request({
    url: 'api/users/updatePass',
    method: 'post',
    data
  })
}

export function updateEmail(form) {
  const data = {
    password: encrypt(form.pass),
    email: form.email,
    code: form.code
  }
  return request({
    url: 'api/users/updateEmail',
    method: 'post',
    data
  })
}

export default { add, edit, del, updateStatus }
