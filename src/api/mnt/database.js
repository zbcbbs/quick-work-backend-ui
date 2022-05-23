import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/database',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/database/' + ids,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/database',
    method: 'put',
    data
  })
}

export function testDbConnection(data) {
  return request({
    url: 'api/database/checkConnection',
    method: 'post',
    data
  })
}

export default { add, edit, del, testDbConnection }
