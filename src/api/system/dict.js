import request from '@/utils/request'

export function getDicts() {
  return request({
    url: 'api/dicts/all',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/dicts',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/dicts/' + ids,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/dicts',
    method: 'put',
    data
  })
}

export default { add, edit, del }
