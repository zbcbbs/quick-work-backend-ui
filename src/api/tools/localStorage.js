import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/local/files',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/local/files/' + ids,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/local/files',
    method: 'put',
    data
  })
}

export default { add, edit, del }
