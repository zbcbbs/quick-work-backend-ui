import request from '@/utils/request'

export function get() {
  return request({
    url: 'api/cos/files/config',
    method: 'get'
  })
}

export function update(data) {
  return request({
    url: 'api/cos/files/config',
    data,
    method: 'put'
  })
}

export function download(id) {
  return request({
    url: 'api/cos/files/download?id=' + id,
    method: 'get',
    responseType: 'blob'
  })
}

export function sync() {
  return request({
    url: 'api/cos/files/synchronize',
    method: 'post'
  })
}

export function del(ids) {
  return request({
    url: 'api/cos/files/' + ids,
    method: 'delete'
  })
}

export default { del, download, sync }
