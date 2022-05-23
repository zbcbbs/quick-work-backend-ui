import request from '@/utils/request'

export function get(tableName) {
  return request({
    url: 'api/gen/configs/' + tableName,
    method: 'get'
  })
}

export function update(data) {
  return request({
    url: 'api/gen/configs',
    data,
    method: 'put'
  })
}
