import request from '@/utils/request'

export function getErrDetail(id) {
  return request({
    url: 'api/logs/' + id,
    method: 'get'
  })
}

export function delAllError() {
  return request({
    url: 'api/logs/deleteAll?status=0',
    method: 'delete'
  })
}

export function delAll() {
  return request({
    url: 'api/logs/deleteAll',
    method: 'delete'
  })
}
